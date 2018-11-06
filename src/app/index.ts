import { UserController } from './controllers/UserController';

export class App {
    static getAllRouters() {
        return {
            ...UserController.getAsRounter(),
        }
    }
}