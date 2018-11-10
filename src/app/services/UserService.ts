import { IUserAuthentication } from './../models/user/interface/IUserAuthentication';
import { UserAuthentication } from './../models/user/UserAuthentication';
import { UserRegister } from './../models/user/UserRegister';
import { IUserUpdate } from './../models/user/interface/IUserUpdate';
import { IUser } from './../models/user/interface/IUser';
import { IUserCreate } from './../models/user/interface/IUserCreate';
import { SimpleCache } from './../../libs/memcache/SimpleCache';
import { ProjectConfig } from './../../system/ProjectConfig';
import { MongooseRepository } from '../../libs/mongoose/MongooseRepository';

export class UserService {
    static userCaching = new SimpleCache();
    static userRepository = new MongooseRepository(ProjectConfig.COLLECTIONS.USER.PATH);

    static async get(_id: string): Promise<IUser> {
        let user = this.userCaching.get(_id);
        if (!user) {
            user = await this.userRepository.get(_id);
            if (user && user._id)
                this.userCaching.cache(user)
        }
        return user;
    }

    static async login(email: string, password: string): Promise<IUserAuthentication | null> {
        let params = {
            query: {
                email,
                password
            }
        }
        let user = await this.userRepository.findOne(params);
        if (!user)
            return null;
        this.userCaching.cache(user);
        return UserAuthentication.from(user);
    }

    static async register(data: IUserCreate): Promise<IUser> {
        let userRegister = UserRegister.from(data);
        return await this.userRepository.create(userRegister);
    }

    static async update(_id: string, data: IUserUpdate): Promise<boolean> {
        let result = await this.userRepository.update(_id, data);
        if (result)
            this.userCaching.cache(await this.userRepository.get(_id));
        return result;
    }

    static async delete(_id: string): Promise<boolean> {
        this.userCaching.expire(_id);
        return await this.userRepository.delete(_id);
    }
}