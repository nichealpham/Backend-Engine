import FirestoreApp from './FirestoreApp';
import * as crypto from 'crypto';

export class FirerayRepository {
    protected path;

    constructor(path: string) {
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

    async create(data: any, bytesLength = 8, encryption = 'hex') {
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

function getRandomBytes(bytesLength: number = 8, encryption: string = 'hex'): string {
    return crypto.randomBytes(bytesLength).toString(encryption);
}
