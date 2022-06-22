import { Request, Response, Router } from "express";
import { loginController } from "../../controllers/user";
import { userMiddleware } from "../../middlewares/auth";
const router = Router();


//NOTE: Configs

//

//NOTE: Routes
router.get("/", userMiddleware, loginController );

//

export default router;