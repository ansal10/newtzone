
const sendJsonResponse =  (res, statusCode, message, data, nextUrl, prevUrl) => {

    let d = {};
    let key = null;
    key = statusCode >= 200 && statusCode < 300 ? 'success' : 'error';
    d[key] = {
        message: message,
        data: data
    };
    if (nextUrl)
        d.nextUrl = nextUrl;
    if (prevUrl)
        d.prevUrl = prevUrl;

    res.status(statusCode).json(d);
};

module.exports.sendJsonResponse = sendJsonResponse;
