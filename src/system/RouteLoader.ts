import { App } from './../app/App';
import { ConsoleColor } from './../app/models/common/ConsoleColor';
import { ProjectConfig } from './ProjectConfig';

export class RouteLoader {
    static config(server) {
        let _count = 1;
        let routes = App.getAllRouters();
        console.log(ConsoleColor.Green, '\n API endpoints: \n');

        for (let routeKey in routes) {
            let middlewares = routes[routeKey];
            let controller = middlewares.splice(middlewares.length - 1, 1)[0];
            let routeParts = routeKey.split('://');
            let method = routeParts[0].toLowerCase();
            let path = `/${ProjectConfig.ALIAS ? ProjectConfig.ALIAS + '/' : ''}${routeParts[1]}`;

            console.log(ConsoleColor.Red, `${_count++}. ${method.toUpperCase()} =>`, ConsoleColor.Cyan, `${path}`);
            server[method](path, ...middlewares, async (req, res) => { requestHandler(req, res, controller) });
        };
    }
}

let requestHandler = async (req, res, controller) => {
    let result, response;
    try {
        result = await controller(req);
        response = {
            statusCode: 200,
            body: result
        }
    }
    catch (err) {
        response = {
            statusCode: 500,
            error: err.toString()
        }
    }
    return res.json(response);
}