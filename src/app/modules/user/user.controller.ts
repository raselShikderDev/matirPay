/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import asyncFunc from "../../utils/asyncFunc";
import { IUser } from "./user.interfaces";
import { userServices } from "./user.service";
import sendResponse from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import mongoose, { Types } from "mongoose";
import myAppError from "../../errorHelper";
import { JwtPayload } from "jsonwebtoken";


// Creatung user
const createUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: Partial<IUser> = req.body;
    const newUser = await userServices.createUser(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User created successfully",
      data: newUser,
    });
  }
);


// Updating user info
const updateUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    
    const payload: Partial<IUser> = req.body;
    const newUser = await userServices.createUser(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User updated successfully",
      data: newUser,
    });
  }
);


// Retriving all User - only admins are allowed
const allUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    
    const {data, meta} = await userServices.allUser(query as Record<string, string>)
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully retrived users",
      data,
      meta:{
        total:meta.totalUser,
        totalpage:meta.page,
        limit:meta.limit
      }
    });
  }
);


// Retriving singel User - only admins are allowed
const singelUser = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req.params
    if(!Types.ObjectId.isValid(userId)){
      throw new myAppError(StatusCodes.BAD_REQUEST, "MongoDB id is not valid")
    }
    const user = await userServices.singelUser(userId)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully retrived user",
      data: user,
    });
  }
);


// Retriving curent User info
const getMe = asyncFunc(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
   
    const user = await userServices.singelUser(decodedToken.userId)

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Successfully current user",
      data: user,
    });
  }
);


// Deleteing user by id
const deleteUser = asyncFunc(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid")
    }
    await userServices.deleteUser(id)
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully deleted user",
    data:null,
    })
})


// Retriving all Agents
const allAgents = asyncFunc(async(req:Request, res:Response, next:NextFunction)=>{    
    const data = await userServices.allAgents()
    
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived all agents",
    data:data.data,
    meta:{
        total:data.meta
    },
    })
})

// Retriving an singel Agent by id
const getSingelAgent = asyncFunc(async(req:Request, res:Response, next:NextFunction)=>{ 
    const id = req.params.id   
    const data = await userServices.getSingelAgent(id)
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:"Successfully retrived agent",
    data:data,
    })
})


// Updating user role to agent by id - only allowed for admins
const agentApproval = asyncFunc(async(req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid")
    }
    const data = await userServices.agentApproval(id)
    
    if (data.updatedToAgent || data.updatedToAgent === null) {
    throw new myAppError(
      StatusCodes.BAD_REQUEST,
      "Failed to update user to agent"
    );
  }
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:data.message,
    data:data.alreadyApproved,
    })
})


// update agent status in a toggle system by id - only admins are allowed
const agentStatusToggle = asyncFunc(async(req:Request, res:Response, next:NextFunction)=>{

    const id = req.params.id
    if (!mongoose.isValidObjectId(id)) {
        throw new myAppError(StatusCodes.BAD_REQUEST, "User id is not valid")
    }
    const data = await userServices.agentStatusToggle(id)
    
    sendResponse(res, {
    statusCode:StatusCodes.OK,
    success:true,
    message:`Agent successfully ${data.isAgentApproved ? "Approved" : "Suspended"}`,
    data:data,
    })
})



export const userController = {
  createUser,
  updateUser,
  allUser,
  singelUser,
  getMe,
  deleteUser,
  allAgents,
  getSingelAgent,
  agentApproval,
  agentStatusToggle,
};
