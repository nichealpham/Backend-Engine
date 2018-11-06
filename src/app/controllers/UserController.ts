import { UserService } from './../services/UserService';

export class UserController {
    static getAsRounter() {
        return {
            'GET://hello/:_name': this.helloWorld,
            'GET://get/:_id': this.getUserById,
        }
    }

    static async helloWorld(req) {
        return `Hello ${req.params._name || 'Guest'}`;
    }

    static async getUserById(req) {
        if (!req.params._id)
            throw new Error('User ID must be provide inside params._id');
        return await UserService.get(req.params._id);
    }
}