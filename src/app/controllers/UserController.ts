import { UserService } from './../services/UserService';

export class UserController {
    static getAsRounter() {
        return {
            'GET://hello': this.helloWorld,
            'GET://get/:_id': this.get,
            'POST://register': this.register,
            'POST://login': this.login,
            'DELETE://delete/:_id': this.delete,
        }
    }

    static async helloWorld(req) {
        return `Hello there ${req.query._name || 'Guest'}`;
    }

    static async get(req) {
        return await UserService.get(req.params._id);
    }

    static async register(req) {
        return await UserService.register(req.body);
    }

    static async login(req) {
        return await UserService.login(req.body.email, req.body.password);
    }

    static async delete(req) {
        return await UserService.delete(req.params._id);
    }
}