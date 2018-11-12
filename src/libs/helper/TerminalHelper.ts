import { exec } from 'child_process';

export class TerminalHelper {
    static async execute(cammand: string): Promise<any> {
        return new Promise<any>((resolve) => {
            let ls = exec(cammand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`\n execute error: ${error}`);
                    return resolve(null);
                }
                if (stderr) {
                    console.log(`\n stderr: ${stderr}`);
                    return resolve(null);
                }
                return resolve(stdout || true);
            });

            ls.stdout.on('data', (data) => {
                if (data.toString()) {
                    console.log(`stdout =======> ${data.toString()}`);
                };
            });

            ls.stderr.on('data', (data) => {
                console.log(`\n stderr: ${data.toString()}`);
            });

            ls.on('exit', (code) => {
                console.log(`\n Process execute successfully! Code: ${code}`);
            });
        });
    }
}