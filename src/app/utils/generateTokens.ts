import { envVarriables } from "../configs/envVars.config";
import { IUser } from "../modules/user/user.interfaces";
import Jwt, { SignOptions }  from "jsonwebtoken";

const generateTokens = async (user: Partial<IUser>) => {
  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = await Jwt.sign(jwtPayload, envVarriables.JWT_ACCESS_SECRET as string, {expiresIn:envVarriables.JWT_ACCESS_EXPIRES} as SignOptions)
  
  
  const refreshToken = await Jwt.sign(jwtPayload, envVarriables.JWT_REFRESH_SECRET as string, {expiresIn:envVarriables.JWT_REFRESH_EXPIRES} as SignOptions)

  return{
    accessToken,
    refreshToken
  }

};

export default generateTokens
