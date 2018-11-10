import { IUserPersonalInfo } from './IUserPersonalInfo';
import { IUserBusinessInfo } from './IUserBusinessInfo';

export interface IUser {
    _id: string;
    email: string;
    password: string;

    firstName: string;
    lastName: string;
    avatar?: string;

    personalInfo?: IUserPersonalInfo;
    businessInfo?: IUserBusinessInfo;

    accessToken: string;
    createdAt: Date;
}