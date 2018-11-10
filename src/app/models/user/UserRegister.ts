import { IUserRegister } from './interface/IUserRegister';
import { CommonFunctions } from './../common/CommonFunctions';
import { IUserCreate } from './interface/IUserCreate';

export class UserRegister {
    static defaultData: IUserRegister = {
        email: '',
        password: '',

        firstName: '',
        lastName: '',

        accessToken: '',
        createdAt: new Date(),
    }

    static from(data: IUserCreate): IUserRegister {
        let userRegister = CommonFunctions.mergeWithoutExtend(this.defaultData, data);
        userRegister.accessToken = CommonFunctions.getRandomBytes(16);
        userRegister.createdAt = new Date();
        return userRegister;
    }
}