import { Authenticator } from './../../system/Authenticator';
import { Middleware } from '../../system/Middleware';
import { UserService } from './../services/UserService';

export class UserController {
    static getAsRounter() {
        return {
            'GET://user/hello': [this.helloWorld],
            'GET://user/:_id': [this.get],
            'POST://user/register': [this.register],
            'POST://user/login': [this.login],
            'PUT://user/avatar/:_id': [Middleware.allowSingleUploadMemory('fileUpload'), this.updateAvatar],
            'DELETE://user/delete/:_id': [this.delete],
        }
    }

    static async helloWorld(req) {
        return `Hello there ${req.query.name || 'Guest'}`;
    }

    static async get(req) {
        if (!await Authenticator.isAuthenticated(req))
            throw new Error('Unauthorized!');
        return await UserService.get(req.params._id);
    }

    static async register(req) {
        return await UserService.register(req.body);
    }

    static async login(req) {
        let userAuthen = await UserService.login(req.body.email, req.body.password);
        if (!userAuthen)
            throw new Error('Login failed! Account cannot be found.');
        Authenticator.authenticate(userAuthen.accessToken, userAuthen);
        return userAuthen;
    }

    static async updateAvatar(req) {
        if (!req.file || !req.file.buffer || !req.file.mimetype)
            throw new Error(`Request must attach with file!`);
        if (!await Authenticator.isAuthenticated(req))
            throw new Error('Unauthorized!');
        return await UserService.updateAvatar(req.params._id, req.file.buffer, req.file.mimetype);
    }

    static async delete(req) {
        if (!await Authenticator.isAuthenticated(req))
            throw new Error('Unauthorized!');
        return await UserService.delete(req.params._id);
    }
}