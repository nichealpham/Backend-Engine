import * as fs from 'fs';
import * as RequestPromise from 'request-promise';
import { SystemHelper } from './SystemHelper';

export class RequestPromiseHelper {
    static async get(url: string, timeout: number = 600000): Promise<any> {
        return new Promise<any>((resolve) => {
            RequestPromise({
                timeout,
                method: 'GET',
                uri: url,
                json: true,
            }).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error);
                resolve(null);
            });
        });
    }

    static async postFile(uri: string, filePath: string, uploadKey: string, jsonData = {}, timeout: number = 600000): Promise<any> {
        if (!SystemHelper.dirExist(filePath))
            return null;
        return new Promise<any>((resolve) => {
            let option: any = {
                uri,
                timeout,
                method: 'POST',
                json: true,
                formData: jsonData || {},
            };
            option.formData[uploadKey] = fs.createReadStream(filePath);
            RequestPromise(option).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error);
                resolve(null);
            });
        });
    }

    static async post(url: string, data?: any, timeout: number = 600000): Promise<any> {
        return new Promise<any>((resolve) => {
            let option: any = {
                timeout,
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
        });
    }

    static async put(url: string, data?: any, timeout: number = 600000): Promise<any> {
        return new Promise<any>((resolve) => {
            let option: any = {
                timeout,
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
        });
    }

    static async delete(url: string, timeout: number = 600000): Promise<any> {
        return new Promise<any>((resolve) => {
            RequestPromise({
                timeout,
                method: 'DELETE',
                uri: url,
                json: true,
            }).then(data => {
                resolve(data);
            }).catch(error => {
                console.log(`\n Request error`, error);
                resolve(null);
            });
        });
    }
}