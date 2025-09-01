/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface"
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin=async(payload:Partial<IUser>)=>{
    const {email,password}=payload;
    
    const isUserExist=await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User does not  exist")
    }

    const isPasswordMatched=await bcryptjs.compare(password as string, isUserExist.password as string);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST,"Incorrect password")
    }

    // const jwtPayload={
    //     userId:isUserExist._id,
    //     email:isUserExist.email,
    //     role:isUserExist.role,

    // }

    
    // const accessToken= generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    // const refreshToken=generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES)


    const userTokens=createUserTokens(isUserExist)

    const {password: pass, ...rest}=isUserExist.toObject();

    return{
        accessToken:userTokens.accessToken,
        refreshToken:userTokens.refreshToken,
        user:rest
    }

}


const getNewAccessToken=async(refreshToken:string)=>{
    const verifiedRefreshToken=verifyToken(refreshToken,envVars.JWT_REFRESH_SECRET) as JwtPayload
   
    
    const isUserExist=await User.findOne({email:verifiedRefreshToken.email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,"User does not  exist")
    }
    if(isUserExist.isActive === IsActive.BLOCKED){
        throw new AppError(httpStatus.BAD_REQUEST,"User is blocked")
    }
    if(isUserExist.isDeleted){
        throw new AppError(httpStatus.BAD_REQUEST,"User is Deleted ")
    }

   

    // if (!isPasswordMatched) {
    //     throw new AppError(httpStatus.BAD_REQUEST,"Incorrect password")
    // }

    const jwtPayload={
        userId:isUserExist._id,
        email:isUserExist.email,
        role:isUserExist.role,

    }

    
    const accessToken= generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

 


    // const userTokens=createUserTokens(isUserExist)

  

    return{
        accessToken
 
    }

}

export const AuthServices={
    credentialsLogin,
    getNewAccessToken,
}