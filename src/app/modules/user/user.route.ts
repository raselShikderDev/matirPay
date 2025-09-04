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

// get count to total approved agent - (Only admins and super admins are allowed)
router.get("/all-approved-agents-count", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.getTotalApprovedAgentCount)

// Get singel Agent by id - (Only admins and super admins are allowed)
router.get("/agents/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.getSingelAgent)

// update user role to agent by id - (Only admins and super admins are allowed)
router.patch("/agent-approve/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.agentApproval)

// Suspend  agent by id - only admins are allowed
router.patch("/agent-suspend/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.agentSuspend)

// Blcok  agent or User by id - only admins are allowed
router.patch("/block/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.blockUser)

// Suspend  agent or User by id - only admins are allowed
router.patch("/suspend/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.suspendUser)

// update agent and user status to in a toggle system by id - (Only admins and super admins are allowed)
router.patch("/agent-status/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.agentAndUserStatusToggle)

// Delete user by id - (Only admins and super admins are allowed)
router.delete("/:id", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.deleteUser)

// Retriving singel User - only admins are allowed
router.get("/:userId", checkAuth(ROLE.ADMIN, ROLE.SUPER_ADMIN), userController.singelUser);

export const userRouter = router;