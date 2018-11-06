import * as RequestPromise from 'request-promise';

export class RequestOnlyHelper {
    static async get(url: string, waitTime: number = 2000): Promise<any> {
        return new Promise<any>((resolve) => {
            RequestPromise({
                method: 'GET',
                uri: url,
                json: true,
            }).then(data => {
                return resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error);
                return resolve(null);
            });
            setTimeout(() => { return resolve(null) }, waitTime);
        });
    }

    static async post(url: string, data?: any, waitTime: number = 2000): Promise<any> {
        return new Promise<any>((resolve) => {
            let option: any = {
                method: 'POST',
                uri: url,
            };
            if (data) {
                option.body = data;
                option.json = true;
            };
            RequestPromise(option).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error);
                resolve(null);
            });
            setTimeout(() => { return resolve(null) }, waitTime);
        });
    }

    static async put(url: string, data?: any, waitTime: number = 2000): Promise<any> {
        return new Promise<any>((resolve) => {
            let option: any = {
                method: 'PUT',
                uri: url,
            };
            if (data) {
                option.body = data;
                option.json = true;
            };
            RequestPromise(option).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error);
                resolve(null);
            });
            setTimeout(() => { return resolve(null) }, waitTime);
        });
    }

    static async delete(url: string, waitTime: number = 2000): Promise<any> {
        return new Promise<any>((resolve) => {
            RequestPromise({
                method: 'DELETE',
                uri: url,
                json: true,
            }).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error);
                resolve(null);
            });
            setTimeout(() => { return resolve(null) }, waitTime);
        });
    }
}