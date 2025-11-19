import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI;

export const DBConnect = async() =>{
    if(!MONGO_URI) throw new Error("MONGO_URI is not present in the env file")
    
    const readyState = mongoose.conection.readyState;
    if(readyState === 1){
        console.log("DB is connected");
        return;
    }
    try{
        await mongoose.connect(MONGO_URI);
        console.log("DB connected");
    } catch(error){
        console.log(`Mongo Connection failed, error: ${error}`)
    }
}