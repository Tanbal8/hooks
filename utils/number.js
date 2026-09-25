const formatNumber = (number) => {
    if (!number) number = 0;
    else if (typeof number === 'string') number = Number(number);
    return number.toLocaleString();
}

const parseNumber = value => {
    return Number(value.replace(/,/g, ''));
}

const showNumber = (number, zeroTransform = '0') => {
    if (number === 0) return zeroTransform; 
    else if (!number) return '';
    else return formatNumber(number);
}

export {
    formatNumber,
    parseNumber,
    showNumber,
};