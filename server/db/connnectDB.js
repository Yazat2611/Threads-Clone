import mongoose from 'mongoose'

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            // usenewUrlParser:true,
            // useUnifiedTopology:true,
            // userCreateIndex:true
        })

        console.log(`MongoDb connected : ${conn.connection.host}`);
    }
    catch(error)
    {
        console.log(`error : ${error.message}`)
        process.exit(1)
    }
}


export default connectDB;