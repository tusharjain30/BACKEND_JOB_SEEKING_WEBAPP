import mongoose from "mongoose";

export const connection = async() => {
    try{

        const dbConnect = await mongoose.connect(process.env.MONGODB_URI)

        if(dbConnect.STATES.connecting){
            console.log("Database is Connecting")
        }

        if(dbConnect.STATES.connected){
            console.log("Database is Connected")
        }

    }catch(err){
        console.log("Database is not connected",err);
    }
}

export default connection;