import * as Mongoose from 'mongoose';
import Schemas from './schema/Index';
import MlabConfig from './MongoosePrivateKeys';

let Connection: any = null;
let ConnectionString = `mongodb://${MlabConfig.USERNAME}:${MlabConfig.PASSWORD}@${MlabConfig.DBDOMAIN}/${MlabConfig.DBNAME}`;

export class MongooseApp {
    static getCollection(collectionName: string) {
        if (!Connection)
            this.initConnection();
        return Connection.model(collectionName, Schemas[collectionName]);
    }

    static async initConnection(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            Connection = Mongoose.createConnection(ConnectionString, {
                useNewUrlParser: true,
            });
            Mongoose.set('useCreateIndex', true);
            Connection.on('error', (error) => {
                console.log("\x1b[31m", `\n Mongoose Connection failed, error: ${error} !`);
                resolve(false);
            });
            Connection.once('open', () => {
                console.log("\x1b[36m", `\n Mongoose Connection established, db: ${MlabConfig.DBNAME} !`);
                resolve(true);
            });
        });
    }
}