import { exec } from 'child_process';

export class TerminalHelper {
    static async execute(cammand: string, showConsole = false): Promise<any> {
        return new Promise<any>((resolve) => {
            let ls = exec(cammand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`\n execute error: ${error.toString().replace('\n', '')}`);
                    return resolve(null);
                }
                if (stderr) {
                    console.log(`\n stderr: ${stderr.toString().replace('\n', '')}`);
                    return resolve(null);
                }
                return resolve(stdout || true);
            });

            if (showConsole) {
                ls.stdout.on('data', (data) => {
                    data = data.toString().replace('\n', '');
                    if (data) {
                        console.log(`stdout =======> ${data}`);
                    };
                });

                ls.stderr.on('data', (data) => {
                    data = data.toString().replace('\n', '');
                    if (data) {
                        console.log(`\n stderr: ${data}`);
                    };
                });

                ls.on('exit', (code) => {
                    console.log(`\n Process execute successfully! Code: ${code}`);
                });
            }
        });
    }
}