import { useState } from "react";
import Fetch from '../utils/fetch';

const useDataManager = (url) => {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('idle');

    const load = async (
        successCallback = () => {},
        failCallback = () => {},
        finallyCallback = () => {},
    ) => {
        try {
            setStatus('loading');
            const result = await Fetch(url);
            setData(result.data);
            setStatus('loaded');
            successCallback(result.data);
        }
        catch (error) {
            setStatus('failed');
            failCallback(error);
            throw error;
        }
        finally {
            finallyCallback();
        }
    }

    const add = async (
        data,
        successCallback = () => {},
        failCallback = () => {},
        finallyCallback = () => {},
    ) => {
        try {
            const result = await Fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            load();
            successCallback(result);
            return result;
        }
        catch (error) {
            failCallback(error);
            throw error;
        }
        finally {
            finallyCallback();
        }
    }

    const update = async (
        id,
        newData,
        successCallback = () => {},
        failCallback = () => {},
        finallyCallback = () => {},
    ) => {

        try {
            const result = await Fetch(`${url}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });
            load();
            successCallback(result);
            return result;
        }
        catch (error) {
            failCallback(error);
            throw error;
        }
        finally {
            finallyCallback();
        }
    }

    const updateMultiple = async (
        updates,
        successCallback = () => {},
        failCallback = () => {},
        finallyCallback = () => {},
    ) => {
        try {
            const result = await Fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });
            load();
            successCallback(result);
            return result;
        }
        catch (error) {
            failCallback(error);
            throw error;
        }
        finally {
            finallyCallback();
        }
    }

    const remove = async (
        id,
        successCallback = () => {},
        failCallback = () => {},
        finallyCallback = () => {},
    ) => {
        try {
            const result = await Fetch(`${url}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(id),
            });
            load();
            successCallback(result);
            return result;
        }
        catch (error) {
            failCallback(error);
            throw error;
        }
        finally {
            finallyCallback();
        }
    }

    const get = (
        which,
        key = 'id',
    ) => {
        return data.find(item => item[key] === which);
    }

    return [data, status, {
        load,
        add,
        update,
        updateMultiple,
        remove,
        get,
    }];
}

export default useDataManager;