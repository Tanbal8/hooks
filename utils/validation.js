import PersianDate from 'tanbal-persian-date';

const validateRef = (ref, callback = value => value) => {
    if (!ref || !ref.current) return null;
    const value = ref.current.value;
    return callback(value);
}

const validateDate = (date) => {
    try {
        const { year, month, day } = date;
        const testDate = new PersianDate(year, month, day);
        return true;
    }
    catch (error) {
        return false;
    }
}

const isDigit = value => value !== '' && !isNaN(value);

export {
    validateRef,
    validateDate,
    isDigit,
};