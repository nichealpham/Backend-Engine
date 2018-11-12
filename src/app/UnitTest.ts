import { ConsoleColor } from './models/common/ConsoleColor';
import { UserService } from './services/UserService';

let _index: number = 0;
let _data: any = null;
let _success: number = 0;
let _failed: number = 0;

export class UnitTest {
    static async run() {
        console.log(ConsoleColor.White, `\n RUNNING UNIT TESTS ...`);
        console.log(ConsoleColor.White, `\n ----------------------------------`);
        try {
            await this.registerUser();
            await this.loginUser();
            await this.updateUser();
            await this.getUserByID();
            await this.deleteUser();
            console.log(ConsoleColor.White, `\n All test finised with:`);
            console.log(ConsoleColor.Red, `\n - ${_failed} failed cases`);
            console.log(ConsoleColor.Green, `\n + ${_success} successful cases`);
            console.log(ConsoleColor.White, `\n ---oOo---`);
            console.log(ConsoleColor.White, `\n`);
        }
        catch (err) {
            console.log(ConsoleColor.White, `\n Running Unit Failed !!! ... \n`, err);
        }
        process.exit();
    }

    static async registerUser() {
        let data = {
            "email": "ffffffff@gmail.com",
            "password": "123456",
            "firstName": "Nicheal",
            "lastName": "Pham"
        };
        let user = await UserService.register(data);
        if (user)
            _data = user;
        writeScreenLog('registerUser', user);
    }

    static async loginUser() {
        let userAuthen = await UserService.login(_data.email, _data.password);
        writeScreenLog('loginUser', userAuthen);
    }

    static async getUserByID() {
        let user = await UserService.get(_data._id);
        writeScreenLog('getUserByID', user);
    }

    static async updateUser() {
        let data = {
            "avatar": "https://znews-photo.zadn.vn/w1024/Uploaded/kcwvouvs/2017_10_19/20431295_1417376751648874_6988552230371036840_n.jpg",
            "personalInfo": {
                "country": "Vietnam",
                "city": "HCM City",
                "address": "",
                "phone": "",
                "postalCode": 70000
            }
        }
        let result = await UserService.update(_data._id, data);
        writeScreenLog('updateUser', result);
    }

    static async deleteUser() {
        let result = await UserService.delete(_data._id);
        writeScreenLog('deleteUser', result);
    }
}

UnitTest.run();

function writeScreenLog(testName, result) {
    _index += 1;
    console.log(ConsoleColor.White, `\n Running test case ${_index} ... \n`);
    if (!result) {
        console.log(ConsoleColor.Red, `\n Status => ${testName} failed. <========================== `);
        _failed += 1;
        return;
    }
    console.log(ConsoleColor.Green, `\n Status => Case ${testName} successful.`);
    console.log(ConsoleColor.Cyan, `\n Result => ${JSON.stringify(result)}`);
    console.log(ConsoleColor.White, `\n ----------------------------------`);
    _success += 1;
};