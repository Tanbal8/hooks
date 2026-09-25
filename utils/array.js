const sum = (
    array,
    which = current => current,
) => {
    return array.reduce(
        (total, current) => total + which(current), 0
    );
}

export {
    sum,
};