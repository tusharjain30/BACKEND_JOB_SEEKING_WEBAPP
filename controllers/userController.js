import catchAsyncError from "../middlewares/catchAsyncError.js"
import ErrorHandler from "../middlewares/error.js"
import User from "../models/userSchema.js";
import sendToken from "../utils/sendToken.js";

//register
const register = catchAsyncError(async(req, res, next) => {
    const { name, email, password, role, number } = req.body;

    if( !name || !email || !password || !role || !number ){
        return next(new ErrorHandler("Please filled all fields", 400))
    }

    const checkEmail = await User.findOne({email})
    if(checkEmail){
        return next(new ErrorHandler("Email is already exists, please login!", 400))
    }

    const user = await User.create({
        name, email, password, role, number
    })

    await user.save()

    sendToken(user, 201, res, "User Create Successfully")
})


//login
const login = catchAsyncError(async(req, res, next) => {
    const { email, password, role } = req.body;

    const user = await User.findOne({email}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password", 400))
    }
    const isPassword = await user.comparePassword(password)

    if(!isPassword){
        return next(new ErrorHandler("Invalid Email or Password", 400))
    }

    if(user.role !== role){
        return next(new ErrorHandler("User role is not found", 404))
    }

    sendToken(user, 200, res, "Login Successfully")
});

//logout
const logout = catchAsyncError(async (req, res) => {
    return res.status(200).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: true,
        sameSite: "None"
    }).json({
        success: true,
        message: "Logout Successfully"
    })
})

const getUser = catchAsyncError((req, res, next) => {
    const user = req.user;

    return res.status(200).json({success: true, user})
})

export { register, login, logout, getUser }