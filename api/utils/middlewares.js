export const onGet = (req, res, next) => {
    console.log('Middleware: GET! ->', req.path);
    next();
};

export const onPost = (req, res, next) => {
    console.log('Middleware: POST! ->', req.path);
    next();
};

export const onPut = (req, res, next) => {
    console.log('Middleware: PUT! ->', req.path);
    next();
};

export const onDelete = (req, res, next) => {
    console.log('Middleware: DELETE! ->', req.path);
    next();
};

export const onRequestInfo = (req, res, next) => {
    const myInfo = {
        query: req.query,
        params: req.params,
        headers: req.headers,
        body: req.body,
    };
    console.log('Middleware: Info:\n', myInfo);
    next();
};

export const onResponse = (req, res, next) => {
    console.log('Middleware: Response\n', res);
    next();
};