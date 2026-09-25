const capitalize = (str) => {
    return str[0].toUpperCase() + str.slice(1);
}

const titleCase = (str) => {
    return str.split(' ').map(
        word => capitalize(word)
    ).join(' ');
}

export {
    capitalize,
    titleCase,
};