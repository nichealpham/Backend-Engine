import { SystemHelper } from './../libs/helper/SystemHelper';
import { ProjectConfig } from './ProjectConfig';

export class SystemLoader {
    static async configSystemFolders() {
        let folders = ProjectConfig.FOLDERS;
        for (let tag of Object.keys(folders)) {
            let name = folders[tag].PATH;
            if (!SystemHelper.dirExist(name)) {
                await SystemHelper.mkDirByFullPath(name);
            };
        };
    }
}