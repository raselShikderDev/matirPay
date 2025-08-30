import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import {  createUserZodSchema, updateUserZodSchema } from "./user.zodSchema";
import checkAuth from "../../middleware/checkAuth";
import { ROLE } from "./user.interfaces";


const router = Router();

// Creatung user
router.post(
  "/create-user",
  validateRequest(createUserZodSchema),
  userController.createUser,
);

//Updating user
router.patch(
  "/update-user",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(ROLE)),
  userController.updateUser,
);


// Retriving all User - only admins are allowed
router.get(
  "/all-user",
  checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN),
  userController.allUser,
);
// Retriving current user ingo
router.get(
  "/me",
  checkAuth(...Object.values(ROLE)),
  userController.getMe,
);


// Get all user - (Only admins and super admins are allowed)
router.get("/all-users", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.allUser)
// Get all Agents - (Only admins and super admins are allowed)
router.get("/all-agents", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.allAgents)
// Get singel Agent by id - (Only admins and super admins are allowed)
router.get("/agents/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.getSingelAgent)

// update user role to agent by id - (Only admins and super admins are allowed)
router.patch("/agent-approve/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.agentApproval)
// update agent status to in a toggle system by id - (Only admins and super admins are allowed)
router.patch("/agent-status/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.agentStatusToggle)
// Delete user by id - (Only admins and super admins are allowed)
router.delete("/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.deleteUser)
// Retriving singel User - only admins are allowed
router.get("/:userId", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.singelUser);

export const userRouter = router;