import { Response } from "express";

interface TMeta {
    page?:number;
    limit?:number;
    totalpage?:number;
    total?:number;
}


 interface TResponse<T>{
    success:boolean;
    message:string;
    statusCode:number;
    data: T;
    meta?:TMeta
}

const sendResponse = <T>(res:Response, data:TResponse<T>)=>{
    res.status(data.statusCode).json({
        success:data.success,
        statusCode:data.statusCode,
        message:data.message,
        data:data.data,
        meta:data.meta
    })
}

export default sendResponse