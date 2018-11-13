import * as serverless from 'serverless-http';
import { EngineServer } from './system/EngineServer';

let app = EngineServer.createServer();

exports.handler = serverless(app);