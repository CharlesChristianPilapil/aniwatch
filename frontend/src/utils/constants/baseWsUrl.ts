const baseWsUrl = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_DEPLOYMENT_WS
    : import.meta.env.VITE_LOCAL_WS;

export default baseWsUrl;