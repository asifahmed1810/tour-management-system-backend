/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status-codes";
import { userServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


// const createUser= async(req:Request, res:Response,next:NextFunction)=>{
// try {
//    const user=await userServices.createUser(req.body)

//     res.status(httpStatus.CREATED).json({
//         message:'User Created Successfully',
//         user
//     })

// } catch (error:any) {
//     console.log(error);
//     next(error)
// }
// }

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userServices.createUser(req.body);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User Created Successfully",
        data:user
    })



  }
);

const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
     const users = await userServices.getAllUsers();
     sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"All User retrived Successfully",
        data:users.data,
        meta:users.meta
    })
})

export const UserControllers = {
  createUser,
  getAllUsers,
};
