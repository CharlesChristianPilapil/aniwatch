const errorHandler = (err, req, res, next) => {
    const message = err.message || 'Internal Server Error'

    if (err.status) {
        res.status(err.status).json({ success: false, message, });
    } else {
        res.status(500).json({ success: false, message, });
    }
};

export default errorHandler;