import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { AiController } from "../controller/ai.controller";

const router = Router();
router.post("/get-response", auth(["user"]), AiController.getResponse);
export const AiRoute = router;
