import { IUserAuthentication } from './../app/models/user/interface/IUserAuthentication';
import { SimpleCache } from './../libs/memcache/SimpleCache';

export class Authenticator {
    static userAuthen = new SimpleCache();

    static isAuthenticated(req) {
        let token: string = req.header['authorization'];
        return this.userAuthen[token] ? true : false;
    }

    static authenticate(token: string, userAuth: IUserAuthentication) {
        this.userAuthen.update(token, userAuth);
    }
}