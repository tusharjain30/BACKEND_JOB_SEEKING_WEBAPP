import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import cloudinary from "cloudinary";
import Application from "../models/applicationSchema.js";
import Job from "../models/jobSchema.js";

const createApplication = catchAsyncError(async (req, res, next) => {

    const { role } = req.user;
    if (role === "Employer") {
        return next(new ErrorHandler("Employer is not allow to this resource", 400))
    }

    const { name, email, number, address, coverLetter, jobId } = req.body;

    if(!name || !email || !number || !address || !coverLetter){
        return next(new ErrorHandler("Please provide all fields", 400))
    }

    const {resume} = req.files;
    
    if(!req.files || Object.keys(req.files).length == 0){
        return next(new ErrorHandler("Resume is required", 400))
    }

    let allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"]
    if(!allowedTypes.includes(resume.mimetype)){
        return next(new ErrorHandler("Invalid file type, please upload your resume in png, jpg and webp type"), 400)
    }

    const cloudinaryResponse = await cloudinary.uploader.upload( resume.tempFilePath )
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.log("Cloudinary error : ", cloudinaryResponse.error)
        return next(new ErrorHandler("Failed to upload resume, try again!", 500))
    }

    if(!jobId){
        return next(new Error("Oops job is not found", 404))
    }

    const job = await Job.findById(jobId)
    if(!job){
        return next(new Error("Oops job is not found", 404))
    }

    const application = await Application.create({
        name,
        email,
        number,
        address,
        coverLetter,
        applicantId: {
            user: req.user._id,
            role: "JobSeeker",
        },
        EmployerId: {
            user: job.postBy,
            role: "Employer"
        },
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url
        },
    })

    return res.status(201).json({success: true, application, message: "Application Send successfully"})
});

const getMyApplication = catchAsyncError(async(req, res, next) => {
    const {role, _id} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer is not allow to this resource", 400));
    }

    const applications = await Application.find({'applicantId.user': _id})
    if(!applications){
        return next(new ErrorHandler("Oops, applications not found", 404));
    } 

    return res.status(200).json({success: true, applications})

})

const deleteMyApplication = catchAsyncError(async (req, res, next) => {
    const {role} = req.user;
    if(role === "Employer"){
        return next(new ErrorHandler("Employer is not allow to this resource", 400));
    }

    const {id} = req.params;
    await Application.findByIdAndDelete(id);
    return res.status(200).json({success: true, message: "Application deleted successfully"});
})

const getAllApplications = catchAsyncError(async(req, res, next) => {
    const {role, _id} = req.user;
    if(role === "JobSeeker"){
        return next(new ErrorHandler("JobSeeker is not allow to this resource", 400));
    }

    const applications = await Application.find({'EmployerId.user': _id})
    if(!applications){
        return next(new ErrorHandler("Oops, applications not found", 404));
    } 

    return res.status(200).json({success: true, applications})

})


export {createApplication, getMyApplication, deleteMyApplication, getAllApplications}