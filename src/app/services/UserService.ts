import { FirerayRepository } from './../../libs/firestore/FirerayRepository';
import { SimpleCache } from './../../libs/memcache/SimpleCache';
import { ProjectConfig } from './../../system/ProjectConfig';

export class UserService {
    static userRepository = new FirerayRepository(ProjectConfig.COLLECTIONS.USER.PATH);
    static userCaching = new SimpleCache();

    static async get(_id: string) {
        let user = this.userCaching.get(_id);
        if (!user) {
            user = await this.userRepository.get(_id);
            if (user && user._id)
                this.userCaching.cache(user)
        }
        return user;
    }
}