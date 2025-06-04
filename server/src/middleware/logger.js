import colors from 'colors';

const logger = (req, res, next) => {
    const method = {
        "POST": colors.yellow,
        "GET": colors.green,
        "DELETE": colors.red,
        "PUT": colors.blue
    }

    //console.log(method[req.method](`[${new Date().toLocaleString()}] ${req.method} ${req.url}`));
    next();
};

export default logger;