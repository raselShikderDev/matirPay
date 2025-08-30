import { Response } from "express";

interface authCookie {
    accessToken?:string,
    refreshToken?:string,
}

const setCookies = async(res:Response, tokens:authCookie)=>{
    if (tokens.accessToken) {
        res.cookie("accessToken", tokens.accessToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none"
    })
    }
    if (tokens.refreshToken) {
        res.cookie("refreshToken", tokens.refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"none"
    })
    }
}

export default setCookies