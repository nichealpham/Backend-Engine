import { SystemLoader } from './SystemLoader';
import { RouteLoader } from './RouteLoader';
import { ProjectConfig } from './ProjectConfig';
import { ConsoleColor } from '../app/models/common/ConsoleColor';

import * as express from 'express';
import * as bodyParser from 'body-parser';

export class EngineServer {
    static createServer() {
        let server = express();
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true }));

        RouteLoader.config(server);
        return server;
    }

    static async startServer() {
        console.log('\n Starting server express ...');
        let server = this.createServer();

        server.listen(ProjectConfig.PORT, () => {
            console.log(ConsoleColor.White, `\n Server is listenning on port ${ProjectConfig.PORT}`);
        });

        SystemLoader.configSystemFolders();
    }
}
