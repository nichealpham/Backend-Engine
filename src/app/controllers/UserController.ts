import { Middlewares } from './../../system/Middlewares';
import { UserService } from './../services/UserService';

export class UserController {
    static getAsRounter() {
        return {
            'GET://user/hello': [
                Middlewares.allowAllTraffic(),
                this.helloWorld],
            'POST://user/register': [
                Middlewares.allowAllTraffic(),
                this.register],
            'POST://user/login': [
                Middlewares.allowAllTraffic(),
                this.login],
            'PUT://user/avatar': [
                Middlewares.allowAllTraffic(),
                Middlewares.allowSingleUploadMemory('fileUpload'),
                this.updateAvatar],
            'DELETE://user/delete/:_id': [
                Middlewares.allowAllTraffic(),
                this.delete],
        }
    }

    static async helloWorld(req) {
        return `Hello there ${req.query.name || 'Guest'}`;
    }

    static async register(req) {
        return await UserService.register(req.body);
    }

    static async login(req) {
        return await UserService.login(req.body.email, req.body.password);
    }

    static async updateAvatar(req) {
        return req.file;
    }

    static async delete(req) {
        return await UserService.delete(req.params._id);
    }
}