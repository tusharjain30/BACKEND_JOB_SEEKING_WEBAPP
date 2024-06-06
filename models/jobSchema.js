import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    country: {
        type: String,
        required: [true, "Country is required"]
    },
    city: {
        type: String,
        required: [true, "City is required"]
    },
    location: {
        type: String,
        required: [true, "Location is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength: [12, "Please provide Job description at least 12 characters"]
    },
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fixedSalary: {
        type: Number,
        minLength: [4, "Please provide fixed Salary at least 4 digits"]
    },
    salaryTo: {
        type: Number,
        minLength: [4, "Please provide SalaryTo at least 4 digits"]
    },
    salaryFrom: {
        type: Number,
        minLength: [4, "Please provide SalaryFrom at least 4 digits"]
    },
    expired: {
        type: Boolean,
        enum: [true, false],
        default: false
    }
}, { timestamps: true });4

const Job = mongoose.model("Job", jobSchema);

export default Job;