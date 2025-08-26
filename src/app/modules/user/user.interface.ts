import { Types } from "mongoose"

export enum Role{
    SUPER_ADMIN="SUPER_ADMIN",
    ADMIN="ADMIN",
    USER="USER",
    GUIDE="GUIDE"
}

export enum IsActive{
    ACTIVE="ACTIVE",
    INACTIVE="INSCTIVE",
    BLOCKED="BLOCKED"
}


export interface IAuthprovider{
    provider:string  ,// Google ,credential
    providerId:string

}


export interface IUser{
    name:string,
    email:string,
    password ?:string,
    phone ?:string,
    picture ?:string,
    address ?:string,
    isDeleted ?:string,
    isActive ?:IsActive,
    isVerified ?:string,
    role :Role,

    auths:IAuthprovider[],
  
    bookings ?:Types.ObjectId[],
    guides ?: Types.ObjectId[]
}