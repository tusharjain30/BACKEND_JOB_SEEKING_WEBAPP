const sendToken = (user, statusCode, res, message) => {
    const token = user.generateToken();
    console.log("generateToken",token)
    return res.status(statusCode).cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        secure: true,
        sameSite: "None"
    }).json({
        success: true,
        user,
        token,
        message
    })
}

export default sendToken;