import { StorageBucket } from './../../libs/storage/StorageBucket';
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
    static userCache = new SimpleCache();
    static userBucket = new StorageBucket(ProjectConfig.STORAGES.AVATAR.PATH);
    static userRepository = new MongooseRepository(ProjectConfig.COLLECTIONS.USER.PATH);

    static async get(_id: string): Promise<IUser> {
        let user = this.userCache.get(_id);
        if (!user) {
            user = await this.userRepository.get(_id);
            if (user && user._id)
                this.userCache.cache(user)
        }
        return user;
    }

    static async findByToken(accessToken: string): Promise<IUserAuthentication> {
        let params = {
            query: {
                accessToken
            }
        };
        let user = await this.userRepository.findOne(params);
        if (!user)
            throw new Error('User does not exist!');
        return UserAuthentication.from(user);
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
        this.userCache.cache(user);
        return UserAuthentication.from(user);
    }

    static async register(data: IUserCreate): Promise<IUser> {
        let userRegister = UserRegister.from(data);
        return await this.userRepository.create(userRegister);
    }

    static async update(_id: string, data: IUserUpdate): Promise<boolean> {
        let result = await this.userRepository.update(_id, data);
        if (result)
            this.userCache.cache(await this.userRepository.get(_id));
        return result;
    }

    static async updateAvatar(_id: string, buffer: Buffer, mimetype: string = 'image/png'): Promise<string> {
        let user = await this.get(_id);
        if (!user)
            throw new Error(`User with ${_id} does not exist!`);
        let fileName = `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}-avatar.${mimetype.split('/')[1]}`;
        let url = await this.userBucket.uploadBuffer(fileName, buffer, true, 'no-cache, no-store, max-age=0', user.email, mimetype);
        if (!url)
            throw new Error(`Cannot upload image at the moment. Please try again shortly.`);
        user.avatar = url;
        await this.update(_id, user);
        return url;
    }

    static async delete(_id: string): Promise<boolean> {
        this.userCache.expire(_id);
        return await this.userRepository.delete(_id);
    }
}