import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.zodSchema";

const router = Router()


// Creatung user
router.post("/create-user", validateRequest(createUserZodSchema), userController.createUser)
// Retriving all user
router.get("/",  userController.allUser)
//Updating user
router.get("/update-user", validateRequest(updateUserZodSchema), userController.allUser)


export const userRouter = router