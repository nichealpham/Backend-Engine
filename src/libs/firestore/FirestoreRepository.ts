import FirestoreApp from './FirestoreApp';
import * as crypto from 'crypto';

export class FirestoreRepository {
    protected counter;
    protected path;

    constructor(path: string) {
        this.counter = FirestoreApp.doc(getCounterPath(path));
        this.path = path;
    }

    async get(_id: string) {
        return new Promise<any>((resolve) => {
            FirestoreApp.collection(this.path).doc(_id).get().then((doc) => {
                if (!doc.exists)
                    resolve(null);
                else {
                    let data = doc.data();
                    if (data.createdAt)
                        data.createdAt = data.createdAt.toDate();
                    if (data.updatedAt)
                        data.updatedAt = data.updatedAt.toDate();
                    resolve(data);
                }
            }).catch(() => { resolve(null) });
        });
    }

    async getNewCount(): Promise<string> {
        let count = padNum2Str(1, 10);
        return new Promise<string>((resolve) => {
            this.counter.get().then((doc) => {
                if (!doc.exists) {
                    return resolve(count);
                }
                else {
                    let { _counts } = doc.data();
                    return resolve(padNum2Str(Number(_counts) + 1, 10));
                }
            }).catch(() => { return resolve('') });
        });
    }

    async count(queries: string[][]): Promise<number> {
        return new Promise<any>((resolve) => {
            let count = 0;
            let collection = FirestoreApp.collection(this.path);
            for (let i = 0; i < queries.length; i++) {
                let query = queries[i];
                collection = collection.where(query[0], query[1], query[2]);
            };
            collection.select().stream().on('data', () => { ++count }).on('end', () => {
                resolve(count);
            });
        });
    }

    async exist(queries: string[][]): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let collection = FirestoreApp.collection(this.path);
            for (let i = 0; i < queries.length; i++) {
                let query = queries[i];
                collection = collection.where(query[0], query[1], query[2]);
            };
            collection.select().stream().on('data', () => {
                collection = null;
                return resolve(true);
            }).on('end', () => {
                return resolve(false);
            });
        });
    }

    async findOne(queries: string[][]) {
        return new Promise<any>((resolve) => {
            let collection = FirestoreApp.collection(this.path);
            for (let i = 0; i < queries.length; i++) {
                let query = queries[i];
                collection = collection.where(query[0], query[1], query[2]);
            };
            collection.stream().on('data', (doc) => {
                collection = null;
                return resolve(doc.data());
            }).on('end', () => {
                return resolve(null);
            });
        });
    }

    async search(queries: string[][], page?: number, limit?: number): Promise<any[]> {
        page = page || 1;
        limit = limit || 10;
        let startAt = (page - 1) * limit;
        let endBefore = startAt + limit;
        let result: any[] = [];
        return new Promise<any[]>((resolve) => {
            let collection = FirestoreApp.collection(this.path);
            for (let i = 0; i < queries.length; i++) {
                let query = queries[i];
                collection = collection.where(query[0], query[1], query[2]);
            };
            let _ind = 0;
            collection.stream().on('data', (doc) => {
                if (_ind >= startAt && _ind < endBefore) {
                    result.push(doc.data());
                }
                else if (_ind >= endBefore) {
                    collection = null;
                    return resolve(result);
                }
                _ind += 1;
            }).on('end', () => {
                return resolve(result);
            });
        });
    }

    async setDoc(data) {
        if (!data._id)
            return null;
        return new Promise<any>((resolve) => {
            FirestoreApp.collection(this.path).doc(data._id).set(data).then(() => { resolve(data) }).catch(() => { resolve(null) });
        });
    }

    async setCounter(_counts: string) {
        return new Promise<any>((resolve) => {
            this.counter.set({ _counts }).then(() => { resolve(_counts) }).catch(() => { resolve(null) });
        });
    }

    async create(data: any) {
        data._id = await this.getNewCount();
        if (!data._id)
            return null;
        let result = await this.setDoc(data);
        if (!result)
            return null;
        await this.setCounter(data._id);
        return result;
    }

    async createWithUniqueId(data: any, bytesLength = 8, encryption = 'hex'): Promise<any> {
        if (!data._id)
            data._id = getRandomBytes(bytesLength, encryption);
        return await this.setDoc(data);
    }

    async update(_id: string, data: any): Promise<boolean> {
        return new Promise<boolean>(async (resolve) => {
            data._id = _id;
            FirestoreApp.collection(this.path).doc(_id).update(data).then(() => { resolve(true) }).catch((err) => { resolve(false) });
        });
    }

    async delete(_id: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            FirestoreApp.collection(this.path).doc(_id).delete().then(() => { resolve(true) }).catch((err) => { resolve(false) });
        });
    }
}

function padNum2Str(number: number, pad = 10): string {
    let result = number.toString();
    while (result.length < pad) { result = '0' + result };
    return result;
}

function getRandomBytes(bytesLength: number = 8, encryption: string = 'hex'): string {
    return crypto.randomBytes(bytesLength).toString(encryption);
}

function getCounterPath(path: string): string {
    return path.substr(
        0, path.lastIndexOf('/') + 1
    ) + '_counts/' + path.substr(
        path.lastIndexOf('/') + 1, path.length
    );
}
