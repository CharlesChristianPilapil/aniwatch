const baseUrl = import.meta.env.MODE === 'production'
    ? "/"
    : import.meta.env.VITE_LOCAL_API;

export default baseUrl;