import { Types } from "mongoose";

export enum USER_STATUS{
    ACTIVE = "ACTIVE",
    DEACTIVE = "DEACTIVE",
    SUSPENDED = "SUSPENDED",
    BLOCKED = "BLOCKED",
}


export enum ROLE {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN",
    AGENT = "AGENT",
}

export interface IAuthProvider{
    provider: "google" | "Credentials"; 
    providerId:string;
}

export interface IUser {
    _id?:Types.ObjectId
    name:string;
    phone?:string;
    email:string;
    password:string;
    address?:string;
    picture?:string;
    role:ROLE;
    auths:IAuthProvider[],
    status?:USER_STATUS,
    isVerified?:boolean;
    isDeleted?:boolean;
    walletId?:Types.ObjectId;
    isAgentApproved?:boolean;
    isTourGuideShown?:boolean
}