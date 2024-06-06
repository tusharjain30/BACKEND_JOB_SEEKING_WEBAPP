import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import connection from "./database/connection.js";
import userRouter from "./routes/userRoute.js";
import jobRouter from "./routes/jobRoute.js";
import applicationRouter from "./routes/applicationRoute.js"

const app = express();

config({
    path: "./.env"
})

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ["POST","PUT","GET","DELETE"],
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())

app.use(express.urlencoded({
    extended: true
}))



app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.use("/api/v1/user", userRouter)
app.use("/api/v1/job", jobRouter)
app.use("/api/v1/application", applicationRouter)

connection();
app.use(errorMiddleware)

export default app;