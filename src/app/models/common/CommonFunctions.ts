import * as crypto from 'crypto';

export class CommonFunctions {
    static mergeWithoutExtend(object1, object2) {
        if (!object2)
            return object1;

        for (let key in object1) {
            object1[key] = object2[key] || object1[key];
        }
        return object1;
    }

    static mergeDeepWithoutExtend(object1, object2) {
        if (!object2)
            return object1;

        for (let key in object1) {
            if (typeof object1[key] === 'object') {
                for (let key2 in object1[key]) {
                    object1[key][key2] = (object2[key] && object2[key][key2]) || object1[key][key2];
                }
            }
            else {
                object1[key] = object2[key] || object1[key];
            }
        }
        return object1;
    }

    static getRandomBytes(bytesLength: number = 8, encryption: string = 'hex'): string {
        return crypto.randomBytes(bytesLength).toString(encryption);
    }

    static padNum2Str(number: number, pad = 10): string {
        let result = number.toString();
        while (result.length < pad) { result = '0' + result };
        return result;
    }

    static async sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        });
    }

    static splitPathAndFileName(fullPath: string): { file: string, path: string } {
        return {
            file: fullPath.slice(fullPath.lastIndexOf('/') + 1, fullPath.length),
            path: fullPath.slice(0, fullPath.lastIndexOf('/'))
        }
    }

    static shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
}