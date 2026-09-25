import { useContext, useRef } from "react";

const useInputBlur = (
    time,
    callback = () => {}
) => {
    const ref = useRef(null);
    const timer = useRef(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        const input = ref?.current;
        if (!input) return;
        const handleInput = () => {
            clearTimeout(timer.current);

            timer.current = setTimeout(() => {
                callbackRef.current(input.value);
            }, time);
        };

        const handleBlur = () => {
            clearTimeout(timer.current);
            callbackRef.current(input.value);
        };

        input.addEventListener('input', handleInput);
        input.addEventListener('blur', handleBlur);

        return () => {
            input.removeEventListener('input', handleInput);
            input.removeEventListener('blur', handleBlur);
            clearTimeout(timer.current);
        };
    }, [ref, time]);


    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return ref;
}

export default useInputBlur;