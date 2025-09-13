
import mongoose from 'mongoose';

export const connectDB = async()=>{

    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
       // console.log(`MongoDB connected: ${conn.connection}`);
       console.log(`MongoDB connected: ${conn.connection.name} at ${conn.connection.host}`); 

    }catch (error){
        console.log(`Error: ${error.message}`);
        process.exit(1) // code 1 means error & 0 means success

    }
}
export default connectDB;