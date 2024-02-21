import Express from "express";
import { createPost,getPost,deletePost,likeUnlike,replyToPost,getFeedPosts,getUserPosts      } from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";
const router= Express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id",getPost)
router.get("/:user/:username",getUserPosts)
router.post("/create",protectRoute,createPost);
router.delete("/:id",protectRoute,deletePost);
router.put("/like/:id",protectRoute,likeUnlike)
router.put("/reply/:id",protectRoute,replyToPost)

export default router
