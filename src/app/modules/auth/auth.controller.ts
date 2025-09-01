/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import { setAuthCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { createUserTokens } from "../../utils/userTokens";
import { envVars } from "../../config/env";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    //  res.cookie("accessToken",loginInfo.accessToken,{
    //   httpOnly:true,
    //   secure:false,
    // })

    // res.cookie("refreshToken",loginInfo.refreshToken,{
    //   httpOnly:true,
    //   secure:false,
    // })

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in Successfully",
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New access token retrived  Successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Logged out  Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})



const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }

    // /booking => booking , => "/" => ""
    const user = req.user;

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    const tokenInfo = createUserTokens(user)

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //     success: true,
    //     statusCode: httpStatus.OK,
    //     message: "Password Changed Successfully",
    //     data: null,
    // })

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})


export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
};
