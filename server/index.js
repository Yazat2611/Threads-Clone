import  Express  from "express";
import dotenv from "dotenv"
import connectDB from "./db/connnectdb.js";
import cookieParser from "cookie-parser";
import postRoutes from "./Routes/postRoutes.js"
import userRoutes from "./Routes/userRoutes.js";
import {v2 as cloudinary} from "cloudinary"
dotenv.config();

connectDB();

const app = Express();

const PORT =  process.env.PORT || 5000;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

//MIDDLEWARES USE KRE HAI YHA 
app.use(Express.json({limit:"50mb"}));
app.use(Express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)


app.listen(PORT,()=>console.log(`Server Started at ${PORT}`));