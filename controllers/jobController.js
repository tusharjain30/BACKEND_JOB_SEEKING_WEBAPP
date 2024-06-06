import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import Job from "../models/jobSchema.js";

const postJob = catchAsyncError(async (req, res, next) => {

    const {role} = req.user;
    if(role === "JobSeeker"){
        return next(new ErrorHandler("Job Seeker is not allow to this Resource", 400));
    }

    const {title, category, country, city, location, description, salaryTo, salaryFrom, fixedSalary} = req.body;

    if(!title || !category || !country || !city || !location || !description){
        return next(new ErrorHandler("Please fill full fields", 400))
    }

    if((!salaryTo || !salaryFrom) && !fixedSalary){
        return next(new ErrorHandler("Please provide either fixedSalary or rangeSalary", 400))
    }

    if(salaryTo && salaryFrom && fixedSalary){
        return next(new ErrorHandler("You cannot provide fixedSalary or rangeSalary together", 400))
    }

    const postJob = await Job.create({
        title, category, country, city, location, description, salaryTo, salaryFrom, fixedSalary, postBy: req.user._id
    })
    
    return res.status(201).json({success: true, message: "Job create successfully"})
   
})

const getAllJobs = catchAsyncError(async(req, res, next) => {
    const jobs = await Job.find({expired: false})
    if(!jobs){
        return next(new ErrorHandler("Oops, jobs not found", 404));
    }
    return res.status(200).json({success: true, jobs});
})

const getMyJobs = catchAsyncError(async(req, res, next) => {

    const {role} = req.user;
    if(role === "JobSeeker"){
        return next(new ErrorHandler("Job Seeker is not allow to this Resource", 400));
    }

    const jobs = await Job.find({postBy: req.user._id, expired: false})

    if(!jobs){
        return next(new Error("Oops, jobs not found", 404));
    }

    return res.status(200).json({success: true, jobs})
})

const getMyAllJobs = catchAsyncError(async(req, res, next) => {

    const {role} = req.user;
    if(role === "JobSeeker"){
        return next(new ErrorHandler("Job Seeker is not allow to this Resource", 400));
    }

    const jobs = await Job.find({postBy: req.user._id})

    if(!jobs){
        return next(new Error("Oops, jobs not found", 404));
    }

    return res.status(200).json({success: true, jobs})
})

const deleteMyJob = catchAsyncError(async(req, res, next) => {
    const {role} = req.user;
    if(role === "JobSeeker"){
        return next(new ErrorHandler("Job Seeker is not allow to this Resource", 400));
    }

    const {id} = req.params;
    const job = await Job.findById(id);
    if(!job){
        return next(new ErrorHandler("Oops, Job not found", 404));
    }
    await job.deleteOne();

    return res.status(200).json({success: true, message: "Job deleted successfully"})
})

const updateMyJob = catchAsyncError(async(req, res, next) => {
    const {role} = req.user;
    if(role === "JobSeeker"){
        return next(new ErrorHandler("Job Seeker is not allow to this Resource", 400));
    }

    const {id} = req.params;

    let job = await Job.findById(id);
   
    if(!job){
        return next(new ErrorHandler("Oops, job not found", 404))
    }

    job  = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    return res.status(200).json({success: true, message: "Job updated successfully"})
})

const getJobDetails = catchAsyncError(async(req, res, next) => {
    const {id} = req.params
    const job = await Job.findById(id)

    if(!job){
        return next(new ErrorHandler("Oops, Job not found", 404))
    }

    return res.status(200).json({success: true, job})
})

export {postJob, getAllJobs, getMyJobs, deleteMyJob, updateMyJob, getJobDetails, getMyAllJobs}