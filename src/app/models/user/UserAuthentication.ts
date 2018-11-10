import { CommonFunctions } from './../common/CommonFunctions';
import { IUser } from './interface/IUser';
import { IUserAuthentication } from './interface/IUserAuthentication';

export class UserAuthentication {
    static defaultData: IUserAuthentication = {
        email: '',
        accessToken: '',
        _id: '',
    }

    static from(data: IUser): IUserAuthentication {
        return CommonFunctions.mergeWithoutExtend(this.defaultData, data);
    }
}