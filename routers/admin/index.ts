import { Request, Response, Router } from "express";
import { getAllUsersController } from "../../controllers/admin";
import { adminMiddleware } from "../../middlewares/auth";
const router = Router();


//NOTE: Configs

//

//NOTE: Routes
router.get("/", adminMiddleware, getAllUsersController );

//

export default router;