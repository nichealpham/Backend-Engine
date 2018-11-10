import { TerminalHelper } from './../libs/helper/TerminalHelper';

// // System requirement for this file to 'npm run docker' properly
// 1. Installed docker on targeted server
// 2. chmod -R 777 /var/run/docker.sock

export class DockerPipeline {
    static environment = 'ubuntu/node8';
    static image = 'cassandra/user';
    static containers = [
        { name: 'cassandra.user.v1', port: '4001:4001' }
    ];

    static async buildEnvironment() {
        try {
            console.log(`\n Try removing previous environment ${this.environment}...`);
            await TerminalHelper.execute(`
                docker rmi -f ${this.environment}:latest
            `);
            console.log(`\n Removing environemt ${this.environment} successful!`);
            console.log(`\n Creating environemt ${this.environment}, please wait...`);
            await TerminalHelper.execute(`
                docker build --rm -t ${this.environment} src/system/
            `);
            console.log(`\n Creating environemt ${this.environment} successful!`);
        }
        catch (err) {
            console.log(`\n Removing environment ${this.environment} failed !`);
            console.log(`This may be due to no environment can be found! No worries.`);
        }
    }

    static async buildImage() {
        try {
            console.log(`\n Try removing previous image ${this.image}...`);
            await TerminalHelper.execute(`
                docker rmi -f ${this.image}:latest
            `);
            console.log(`\n Removing image ${this.image} successful!`);
            console.log(`\n Creating image ${this.image}, please wait...`);
            await TerminalHelper.execute(`
                docker build --rm -t ${this.image} .
            `);
            console.log(`\n Creating image ${this.image} successful!`);
        }
        catch (err) {
            console.log(`\n Removing image ${this.image} failed !`);
            console.log(`This may be due to no environment can be found! No worries.`);
        }
    }

    static async startContainers() {
        for (let i = 0; i < this.containers.length; i++) {
            let container = this.containers[i];
            try {
                console.log(`\n Try stoping container ${container.name}...`);
                await TerminalHelper.execute(`
                    docker stop ${container.name}
                `);
                console.log(`\n Stoping ${container.name} successful. Start a new one shortly !`);
                console.log(`\n Starting container ${container.name}, please wait...`);
                await TerminalHelper.execute(`
                    docker run --rm -d --name ${container.name} -p ${container.port} ${this.image}:latest
                `);
                console.log(`\n Starting container ${container.name} successful!`);
            }
            catch (err) {
                console.log(`\n Stop container ${container.name} failed !`);
                console.log(`This may be due to no container can be found! No worries.`);
            }
        }
    }
}

async function run() {
    await DockerPipeline.buildEnvironment();
    await DockerPipeline.buildImage();
    await DockerPipeline.startContainers();
}
run();