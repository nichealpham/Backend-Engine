export class SimpleCache {
    public storage: any = {};

    constructor(storage?: any) {
        if (storage)
            this.storage = storage;
    }

    cache(data) {
        if (!data || !data._id)
            return null;
        this.storage[data._id] = data;
        return data;
    }

    // Use for Class, Instance, Interface...
    // Share this data accross functions
    get(_id: string) {
        return this.storage[_id];
    }

    // Create & return a complete copy of Object data
    // use when the data can get changed later by push(), shift(),...
    getFreshCopy(_id) {
        let result;
        if (this.storage[_id]) {
            let data = JSON.parse(JSON.stringify(this.storage[_id]));
            result = JSON.parse(JSON.stringify(data));
        }
        return result;
    }

    // Use for Class, Instance, Interface...
    update(_id: string, data) {
        this.storage[_id] = data;
        return true;
    }

    // Only use for Object
    updateFields(_id: string, data) {
        if (!this.storage[_id])
            return false;
        this.storage[_id] = { ...this.storage[_id], ...data };
        return true;
    }

    expire(_id) {
        delete this.storage[_id];
    }

    export() {
        return this.storage;
    }

    import(storage) {
        this.storage = storage;
    }
}