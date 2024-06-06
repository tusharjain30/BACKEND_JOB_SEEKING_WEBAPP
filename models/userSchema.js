import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minLength: [3, "Name must be at least 3 characters"],
        maxLength: [14, "Name cannot exceed 14 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "This email is already exists, please provide unique email"],
        validate: [validator.isEmail, "Please provide valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false
    },
    number: {
        type: Number,
        required: [true, "Phone Number is required"],
    },
    role: {
        type: String,
        required: [true, "Please provide your role"],
        enum: ["Employer", "JobSeeker"]
    }
}, {timestamps: true});

//hash password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10);
});

//compare password method
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//generate token
userSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id}, process.env.TOKEN_SECRET_KEY, {
        expiresIn: process.env.TOKEN_EXPIRES_IN
    })
}

const User = mongoose.model("User", userSchema)

export default User;