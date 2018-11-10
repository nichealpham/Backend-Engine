import { FirestoreRepository } from './FirestoreRepository';
import { CommonFunctions } from '../../app/models/common/CommonFunctions';

export class FirerayRepository {
    public path;
    public pattern;
    public connections;

    constructor(path: string, pattern) {
        this.path = path;
        this.pattern = pattern;
        this.connections = {};
    }

    connect(params) {
        params = CommonFunctions.mergeWithoutExtend(this.pattern, params);
        let path = this.path;
        Object.keys(params).forEach(name => {
            path = path.replace(`[${name}]`, params[name])
        });
        if (!this.connections[path])
            this.connections[path] = new FirestoreRepository(path);
        return this.connections[path];
    }
}
