import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set as setObject, get as getObject } from '../utils/object';

const useQueryParams = (initialState = {}, keys = {}, options = {}) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [state, setState] = useState(initialState);
    const { syncInitialParams = true } = options;
    
    const isEmpty = (value, key) => {
        const emptyValues = getEmptyValues(key);
        return !value || emptyValues.includes(value);
    }
    
    const getPath = (key) => {
        return keys?.[key]?.['path'];
    }
    
    const getEmptyValues = (key) => {
        return keys?.[key]?.emptyValues || [''];
    }
    
    const inputTransform = (key, value) => {
        const callback = keys?.[key]?.inputTransform || (value => value);
        return callback(value);
    }

    const  paramsTransform = (key, value) => {
        const callback = keys?.[key]?.paramsTransform || (value => value);
        return callback(value);
    }

    const replaceParams = (params) => {
        router.replace(`?${params.toString()}`, { scroll: false });
    }

    const validateKey = key => {
        if (!Object.hasOwn(keys, key)) {
            throw new Error(`Invalid query param key: ${key}`);
        }
    };

    const forEachKey = (
        keys,
        path = value => value,
        notEmptyCallback = () => {},
        emptyCallback = () => {},
    ) => {
        Object.entries(keys).forEach(([key, config]) => {
            const newValue = inputTransform(key, path(config));
            const empty = isEmpty(newValue, key);
            if (empty) emptyCallback(key, newValue);
            else notEmptyCallback(key, newValue);
        });
    };
    
    const get = (key) => {
        validateKey(key);
        const value = searchParams.get(key);
        if (isEmpty(value, key)) return null;
        return value;
    }

    const getStateFromParams = (prevState) => {
        let newState = { ...prevState };
        Object.keys(keys).forEach(key => {
            const value = get(key);
            if (value !== null) {
                newState = setObject(
                    newState,
                    getPath(key),
                    paramsTransform(key, value),
                );
            }
        });
        return newState;
    };
    
    const removeParam = key => {
        const params = new URLSearchParams(searchParams);
        params.delete(key);
        replaceParams(params);
    };


    const setParam = (key, value) => {
        const params = new URLSearchParams(searchParams);
        params.set(key, value);
        replaceParams(params);
    };

    const remove = (key, replace = true) => {
        validateKey(key);
        setState(prevState =>
            setObject(prevState, getPath(key), '')
        );
        if (replace) removeParam(key);
    };
    
    const set = (key, value, replace = true) => {
        validateKey(key);
        const newValue = inputTransform(key, value);
        if (isEmpty(newValue, key)) {
            remove(key, replace);
            return;
        }
        setState(prevState =>
            setObject(prevState, getPath(key), newValue)
        );
        if (replace) setParam(key, newValue);
    };

    const setMultiple = (newValues) => {
        const params = new URLSearchParams(searchParams);
        forEachKey(
            newValues,
            value => value,
            (key, value) => params.set(key, value),
            key => params.delete(key),
        );
        setState(prevState => {
            let newState = prevState;
            forEachKey(
                newValues,
                value => value,
                (key, value) => {
                    newState = setObject(newState, getPath(key), value);
                },
                key => {
                    newState = setObject(newState, getPath(key), '');
                },
            );
            return newState;
        });
        replaceParams(params);
    };
    
    const removeParams = (paramsList = []) => {
        const params = new URLSearchParams(searchParams);
        paramsList.forEach(key => {
            params.delete(key);
        });
        setState(prevState => {
            let newState = prevState;
            paramsList.forEach(key => {
                newState = setObject(newState, getPath(key), '');
            });
            return newState;
        });
        replaceParams(params);
    };

    const reset = () => {
        removeParams(Object.keys(keys));
    }

    useEffect(() => {
        setState(prevState => getStateFromParams(prevState));
    }, [searchParams]);

    useEffect(() => {
        if (!syncInitialParams) return;
        const params = new URLSearchParams(searchParams);
        forEachKey(
            keys,
            config => getObject(initialState, config.path),
            (key, value) => {
                if (!params.has(key)) {
                    params.set(key, value);
                }
            },
        );
        replaceParams(params);
    }, []);

    return [{
        get,
        set,
        setMultiple,
        remove,
        removeParams,
        reset,
        getPath,
    }, state, setState];
}

export default useQueryParams;