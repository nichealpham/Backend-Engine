import { IUserPersonalInfo } from "./IUserPersonalInfo";
import { IUserBusinessInfo } from "./IUserBusinessInfo";

export interface IUserUpdate {
    email?: string;
    password?: string;

    firstName?: string;
    lastName?: string;
    avatar?: string;

    personalInfo?: IUserPersonalInfo;
    businessInfo?: IUserBusinessInfo;
}