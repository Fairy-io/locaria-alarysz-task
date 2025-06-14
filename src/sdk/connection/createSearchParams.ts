export const createSearchParams = (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any,
) => {
    const urlSearchParams = new URLSearchParams();

    if (method === 'POST' || method === 'PUT') {
        return urlSearchParams;
    }

    for (const [key, value] of Object.entries(data || {})) {
        if (typeof value === 'string') {
            urlSearchParams.set(key, value);
        }

        if (typeof value === 'number') {
            urlSearchParams.set(key, value.toString());
        }

        if (typeof value === 'boolean') {
            urlSearchParams.set(key, value.toString());
        }

        if (typeof value === 'object') {
            urlSearchParams.set(key, JSON.stringify(value));
        }

        delete data[key];
    }

    return urlSearchParams;
};
