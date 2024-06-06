import ErrorHandler from "./error.js"
import catchAsyncError from "./catchAsyncError.js"
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

// check user is authorized or not!
const isAutherized = catchAsyncError(async (req, res, next) => {
    const {token} = req.cookies;
    console.log("token ->", token);
    if(!token){
        return next(new ErrorHandler("User is not Authorized"))
    }

    const decode = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    req.user = await User.findById(decode.id)
    next();
})

export default isAutherized;