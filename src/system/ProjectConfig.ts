export class ProjectConfig {
    static NAME = 'UserService.Cassandra';
    static URL = process.env.NODE_ENV === 'Production' ? 'http://35.189.25.219' : 'http://localhost';
    static PORT = 4001;
    static ALIAS = 'user';

    static SYSTEM_FOLDERS = {
        UPLOAD: { PATH: './tmp/uploads', TYPE: 'local' },
    };

    static COLLECTIONS = {
        AUTHENTICATION: { PATH: 'authentication', DB_TYPE: 'firestore' },
        USER: { PATH: 'user', DB_TYPE: 'mongoose' },
    };

    static STORAGES = {
        AVARTA: { PATH: 'user/avarta', TYPE: 'storage' },
    };

    static SERVICES = {
        TENSORFLOW: {
            URL: process.env.NODE_ENV === 'Production' ?
                'http://35.189.25.219:4003/tfjs' : 'http://localhost:4003/tfjs',
            TIMEOUT: 30000,
        }
    };

    static APIS = [
        'GET://user/hello/:_name',
        'GET://user/get/:_id',
        'POST://user/register',
        'POST://user/login',
        'DELETE://user/delete/:_id',
    ];

    static CLOUD_PROVIDER = {
        NAME: 'AWS',
        SERVICE: 'Lambda',
        RUNTIME: 'nodejs8.10',
        REGION: 'ap-southeast-1',
        MEMORYSIZE: 1024,
        TIMEOUT: 300,
    };

    // static COLLECTIONS = {
    //     USER: { PATH: 'user', DB_TYPE: 'firestore' },
    //     USER: {
    //         PATH: '[USER_EMAIL]/info', DEFAULT_PARAMS: {
    //             USER_EMAIL: 'guest@gmail.com'
    //         }, DB_TYPE: 'fireray'
    //     }
    // };
}

class CloudPlatform {
    static AWS = {
        NAME: 'AWS',
        SERVICE: 'Lambda',
        RUNTIME: 'nodejs8.10',
        REGION: 'ap-southeast-1',
        MEMORYSIZE: 1024,
        TIMEOUT: 300,
    }

    static GCP = {
        NAME: 'GCP',
        SERVICE: 'App Engine',
        RUNTIME: 'nodejs',
        REGION: 'us-central1'
    }

    static FPT = {
        NAME: 'FPT',
        SERVICE: 'OpenShift',
        ENVIRONMENT: 'Docker',
        RUNTIME: 'ubuntu/node8',
    }

    static AZURE = {
        NAME: 'AZURE',
        SERVICE: 'Function',
        RUNTIME: 'nodejs',
    }
}