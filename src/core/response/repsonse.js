export const successResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        message,
        data,
    });
};

export const errorResponse = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
        message,
        errors,
    });
};