import * as cors from 'cors';
import * as multer from 'multer';

import { SystemHelper } from '../libs/helper/SystemHelper';
import { ProjectConfig } from './ProjectConfig';
import { CommonFunctions } from '../app/models/common/CommonFunctions';

export class Middleware {
    static allowAllTraffic() {
        return cors();
    }

    static allowOnlyLocalhost() {
        return cors({
            origin: 'http://localhost',
            optionsSuccessStatus: 200,
        })
    }

    static allowSingleUploadMemory(fileKey: string) {
        return multer({ storage: multer.memoryStorage() }).single(fileKey);
    }

    static allowMultipleUploadMemory(fileKey: string) {
        return multer({ storage: multer.memoryStorage() }).array(fileKey);
    }

    static allowSingleUploadStorage(fileKey: string) {
        return multer({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    let folderName = ProjectConfig.FOLDERS.UPLOAD.PATH + '/';
                    if (!SystemHelper.dirExist(folderName))
                        SystemHelper.mkDirByFullPath(folderName);
                    cb(null, folderName)
                },
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + '-' + CommonFunctions.getRandomBytes(16))
                }
            })
        }).single(fileKey);
    }

    static allowMultipleUploadStorage(fileKey: string) {
        return multer({
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    let folderName = ProjectConfig.FOLDERS.UPLOAD.PATH + '/';
                    if (!SystemHelper.dirExist(folderName))
                        SystemHelper.mkDirByFullPath(folderName);
                    cb(null, folderName)
                },
                filename: function (req, file, cb) {
                    cb(null, file.fieldname + '-' + CommonFunctions.getRandomBytes(16))
                }
            })
        }).array(fileKey);
    }
}