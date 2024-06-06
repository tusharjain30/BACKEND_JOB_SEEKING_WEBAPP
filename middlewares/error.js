class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

export const errorMiddleware = async(err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;

    if(err.name == "CastError"){
        const message = `Resource not found, Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    if(err.code == 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    if(err.name == "JsonWebTokenError"){
        const message = "Json web token is Invalid, try again!";
        err = new ErrorHandler(message, 400);
    }

    if(err.name == "TokenExpiredError"){
        const message = "Token is expired, try again!";
        err = new ErrorHandler(message, 400);
    }
    
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
    
}

export default ErrorHandler;