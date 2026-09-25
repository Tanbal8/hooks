import { validateRef } from './validation';

const enterNavigation = (
    refs = [],
    submitCallback = () => {},
    condition = () => true,
) => {
    const defaultCallback = value => value;
    const defaultValidation = () => true;
    const listeners = [];

    refs = refs.filter(item => !item.skip && item.ref && item.ref.current);

    for (let a = 0 ; a < refs.length ; a++) {
        const item = refs[a];
        const ref = item.ref;
        const callback = item.callback || defaultCallback;
        const validation = item.validation || defaultValidation;
        
        const listener = e => {
            if (e.key !== 'Enter' || !condition()) return;
            
            e.preventDefault();

            const value = validateRef(ref, callback);

            if (!validation(value)) return;

            if (a < refs.length - 1) {
                refs[a + 1].ref.current.focus();
            }
            else {
                submitCallback();
            }
        };

        const element = ref.current;
        element.addEventListener('keydown', listener);
        listeners.push(() => element.removeEventListener('keydown', listener));
    }

    return () => {
        listeners.forEach(removeListener => removeListener());
    };
};

export {
    enterNavigation,
};