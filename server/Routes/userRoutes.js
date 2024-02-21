import Express from "express";
import {signupUser,loginUser, logoutUser, followUnfollowUser, updateUser, getUserProfile}  from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";
const router = Express.Router();

router.get("/profile/:query",getUserProfile)
router.post("/signup",signupUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser)
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.put("/update/:id", protectRoute, updateUser);


export default router;

                 