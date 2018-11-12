export class ProjectConfig {
    static NAME = 'UserService.Cassandra';
    static URL = 'http://localhost';
    static PORT = 4001;
    static ALIAS = '';

    static FOLDERS = {
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
                'http://35.231.114.91:4003/tfjs' : 'http://localhost:4003/tfjs',
            TIMEOUT: 30000,
        }
    };

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