export const getEndpoint = (
    endpoint: string,
    data?: any,
) => {
    const endpointParts = endpoint.split('/');

    for (const [index, part] of endpointParts.entries()) {
        if (part.startsWith(':')) {
            const key = part.slice(1);
            const value = data[key];

            endpointParts[index] = value;
            delete data[key];
        }
    }

    return endpointParts.join('/');
};
