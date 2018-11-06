import { exec } from 'child_process';

export class TerminalHelper {
    static async execute(cammand: string): Promise<any> {
        return new Promise<any>((resolve) => {
            exec(cammand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`execute error: ${error}`);
                    return resolve(null);
                }
                if (stderr) {
                    console.log(`stdout: ${stderr}`);
                    return resolve(null);
                }
                return resolve(stdout || true);
            });
        });
    }
}