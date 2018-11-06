import { CommonFunctions } from './../app/models/common/CommonFunctions';
import { ProjectConfig } from './ProjectConfig';
import { ConsoleColor } from '../app/models/common/ConsoleColor';
import { App } from '../app';
import { SystemHelper } from '../libs/helper/SystemHelper';

import * as multer from 'multer';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

// For APIs that are not registered inside ProjectConfig.APIS, allow only for internal usage
let AllowOrigin = {
    origin: 'http://localhost',
    optionsSuccessStatus: 200,
};

// Prepare the server
let Multer = {
    SingleUpload: (key) => multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                let folderName = ProjectConfig.SYSTEM_FOLDERS.UPLOAD.PATH + '/';
                if (!SystemHelper.dirExist(folderName))
                    SystemHelper.mkDirByFullPath(folderName);
                cb(null, folderName)
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + CommonFunctions.getRandomBytes(16))
            }
        })
    }).single(key),
    MultipleUpload: (key) => multer({ storage: multer.memoryStorage() }).array(key),
};

export class EngineServer {
    static startServer() {
        console.log('\n Starting server express ...');
        let server: any = this.createServer();

        server.listen(ProjectConfig.PORT, () => {
            console.log(ConsoleColor.White, `\n Server is listenning on port ${ProjectConfig.PORT}`);
        });

        for (let tag of Object.keys(ProjectConfig.SYSTEM_FOLDERS)) {
            let folderName = ProjectConfig.SYSTEM_FOLDERS[tag].PATH;
            if (!SystemHelper.dirExist(folderName))
                SystemHelper.mkDirByFullPath(folderName);
        };
    }

    static createServer() {
        let server = express();
        server.use(bodyParser.json());
        server.use(bodyParser.urlencoded({ extended: true }));

        this.configRounters(server);
        return server;
    }

    static configRounters(app) {
        // Import routers
        let _count = 1;
        let routes = App.getAllRouters();
        // Loop to register routers
        console.log(ConsoleColor.Green, '\n API endpoints: \n');

        let callbackHandler = async (req, res, controller) => {
            let result, response;
            let isError = false;
            try {
                result = await controller(req);
                response = {
                    statusCode: 200,
                    body: result
                }
            }
            catch (err) {
                isError = true;
                response = {
                    statusCode: 500,
                    error: err
                }
            }
            if (!isError)
                return res.json(response);
            else
                return res.status(500).json(response);
        }

        for (let rtString in routes) {
            let controller: (req) => Promise<any> = routes[rtString];
            let rts = rtString.split('://');
            let path = `/${ProjectConfig.ALIAS}/${rts[1]}`;
            let method = rts[0].toLowerCase();
            let uploader = rts[2];
            let uploadKey = rts[3];

            if (!uploader || !uploadKey) {
                console.log(ConsoleColor.Red, `${_count++}.  ${method.toUpperCase()} =>`, ConsoleColor.Cyan, `${path}`);
                if (ProjectConfig.APIS.includes(rtString))
                    app[method](path, cors(), async (req, res) => { callbackHandler(req, res, controller) });
                else
                    app[method](path, cors(AllowOrigin), async (req, res) => { callbackHandler(req, res, controller) });
            }
            else {
                console.log(ConsoleColor.Red, `${_count++}.  ${method.toUpperCase()} =>`, ConsoleColor.Cyan, `${path} + (${uploader}, key: ${uploadKey})`);
                if (ProjectConfig.APIS.includes(rtString))
                    app[method](path, Multer[uploader](uploadKey), cors(), async (req, res) => { callbackHandler(req, res, controller) });
                else
                    app[method](path, Multer[uploader](uploadKey), cors(AllowOrigin), async (req, res) => { callbackHandler(req, res, controller) });
            }
        };
    }
}
