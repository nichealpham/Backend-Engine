import { IUserAuthentication } from './../app/models/user/interface/IUserAuthentication';
import { SimpleCache } from './../libs/memcache/SimpleCache';
import { UserService } from '../app/services/UserService';

export class Authenticator {
    static userAuthen = new SimpleCache();

    static async isAuthenticated(req) {
        if (!req.params || !req.headers)
            return false;

        let token: string = req.headers['authorization'];
        if (!token)
            return false;

        let userAuthen = this.userAuthen.get(token);
        if (!userAuthen) {
            userAuthen = await UserService.findByToken(token);
            if (!userAuthen)
                return false;
            this.authenticate(token, userAuthen);
        }
        return userAuthen._id.toString() === req.params._id.toString() ? true : false;
    }

    static authenticate(token: string, userAuth: IUserAuthentication) {
        this.userAuthen.update(token, userAuth);
    }
}