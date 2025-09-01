import express, {  Request, Response } from "express";


import cookieParser from "cookie-parser";
import cors from "cors"
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandlers";
import notFound from "./app/middlewares/notFound";
import passport from "passport";
import expressSession from "express-session";




const app=express();

app.use(expressSession({
    secret:"Your secret",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(cookieParser())
app.use(express.json());
app.use(cors())
app.use("/api/v1",router)




app.get('/',(req:Request,res:Response)=>{
    res.status(200).json({
        message:'Welcome to Tour management App '
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalErrorHandler)

app.use(notFound)


export default app;