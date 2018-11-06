import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { TerminalHelper } from './TerminalHelper';

export class SystemHelper {
    static dirExist(path: string): Boolean {
        let result: boolean = false;
        try {
            result = fs.existsSync(path);
        }
        catch (err) {
            return false;
        }
        return result;
    }

    static isDirectory(path: string): Boolean {
        return fs.existsSync(path) && fs.lstatSync(path).isDirectory();
    }

    static createDir(path: string): Boolean {
        if (!fs.existsSync(path)) {
            try { fs.mkdirSync(path) }
            catch (err) { return false }
        }
        return true;
    }

    static async mkDirByFullPath(targetDir: string) {
        let cmd = `mkdir -p ${targetDir}`;
        return await TerminalHelper.execute(cmd);
    }

    static async removeDir(path): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            if (fs.existsSync(path)) {
                try { rimraf(path, () => { return resolve(true) }) }
                catch (error) { return reject(error) }
            };
            return resolve(true);
        })
    }

    static async writeBuffer(fullPath: string, data: Buffer): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            fs.writeFile(fullPath, data, (err) => {
                if (err)
                    return reject(err);
                return resolve(true);
            });
        })
    }

    static async readBuffer(fullPath: string): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            fs.readFile(fullPath, (err, data) => {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        })
    }
}