const Fetch = async (url, options = {}) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    const result = await response.json();
    if (result.error) {
        throw new Error(result.error);
    }
    return result;
}

export default Fetch;