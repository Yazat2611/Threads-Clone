import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateSet from "../util/helpers/generateSet.js";
import {v2 as cloudinary} from "cloudinary"
import mongoose from "mongoose";

// Ye function sign up kra rha
const signupUser = async(req,res) => {
    try{
        
        const {name,email,username,password} = req.body;
        const user = await User.findOne({$or:[{email},{username}]});
        if(user){
            return res.status(400).json({error:"User already exsist"});
        }

        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(password,salt);

        const newUser = new User({
            name,
            email,
            username,
            password:hash
        })

        
        await newUser.save();
        
        if(newUser){
            generateSet(newUser._id,res);

            res.status(201).json({
                _id:newUser._id,
                name:newUser.username,
                email:newUser.email,
                password:newUser.password,
                bio:newUser.bio,
                profilePic:newUser.profilePic
            });
        }

        else
        {
            res.status(400).json({error:"Invalid"})
        }
    }
    catch(error)
    {
        res.status(500).json({error:error.message})

        console.log("Error : ",error.message);
    }
}

//Ye function se login
const loginUser = async(req,res) => {
    try{
        const {username,password} = req.body;

        const user = await User.findOne({username})
        const isPass = await bcrypt.compare(password,user?.password || "")

        if(!user || !isPass) return res.status(400).json({error:"Invalid Username or Password"})

        generateSet(user._id,res)
    
        res.status(200).json({
            _id: user._id,
            name:user.name,
            email:user.email,
            username:user.username,
            bio:user.bio,
            profilePic:user.profilePic
        })
    }

    catch(error){
        res.status(500).json({error:error.message})

        console.log("Login Failed",error.message)
    }
}

//Ye logout krne ke liye hai
const logoutUser = async(req,res) => {

    try{
        res.cookie("jwt","",{maxAge:1})
        res.status(200).json({message:"Logout Succesfull"})
    }

    catch(error)
    {
        res.status(500).json({error:error.message});
        console.log("Their was an errror while doing logout",error.message);
    }
}

//Ye follow Unfollow krne ke liye hai

const followUnfollowUser = async(req,res) => {
    try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
			return res.status(400).json({ error: "You cannot follow/unfollow yourself" });

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
			res.status(200).json({ message: "User unfollowed successfully" });
		} else {    
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in followUnFollowUser: ", err.message);
	}
}

//Ye update krne ke liye hai
const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let {profilePic} = req.body
  
    const userId = req.user._id;
  
    try {
      let existingUser = await User.findById(userId); 

      if(req.params.id!==userId.toString()) return res.status(400).json({error:"You Cannot update other users profile"})
      if (!existingUser) return res.status(400).json({ error: "User not Found" });
      
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        existingUser.password = hash;
      }

      if(profilePic){
        if(existingUser.profilePic)
        {
            await cloudinary.uploader.destroy(existingUser.profilePic.split("/").pop().split(".")[0])
        }


        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        profilePic = uploadResponse.secure_url
      }
  
      existingUser.name = name || existingUser.name;
      existingUser.email = email || existingUser.email;
      existingUser.username = username || existingUser.username;
      existingUser.profilePic = profilePic || existingUser.profilePic;
      existingUser.bio = bio || existingUser.bio;
  
      existingUser = await existingUser.save();

      existingUser.password = null
  
      res.status(200).json({ message: "Profile updated Successfully", user: existingUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log("Error in Updating", error.message);
    }
  };

  
//Ye search krne ke liye profile ko
const getUserProfile = async(req,res) => {
    const {query} = req.params


    try{
        let user;
        
        if(mongoose.Types.ObjectId.isValid(query))
        {
            user = await User.findOne({_id:query}).select("-password").select("-updatedAt")
        }

        else
        {
            
        user = await User.findOne({username:query}).select("-password").select("-updatedAt")
        
        }
        
    
        if(!user) return res.status(400).json({error:"User not found"})

        res.status(200).json(user)
    }

    catch(error)
    {
        res.status(500).json({error:error.message})

        console.log("Error in getting data",error.message);
    }
}
  
export {signupUser,loginUser,logoutUser,followUnfollowUser,updateUser,getUserProfile}