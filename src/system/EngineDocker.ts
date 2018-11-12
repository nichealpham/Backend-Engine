import { ProjectConfig } from './ProjectConfig';
import { TerminalHelper } from '../libs/helper/TerminalHelper';

export class EngineDocker {
    static image = 'cassandra/user';
    static containers = [
        { name: 'cassandra.user.v1', port: `${ProjectConfig.PORT}:${ProjectConfig.PORT}` }
    ];

    static async removeImage() {
        console.log(`\n Try removing previous image ${this.image}...`);
        await TerminalHelper.execute(`docker rmi -f ${this.image}`);
    }

    static async stopContainers() {
        for (let i = 0; i < this.containers.length; i++) {
            let container = this.containers[i];
            console.log(`\n Try stoping container ${container.name}...`);
            await TerminalHelper.execute(`docker stop ${container.name}`);
        }
    }

    static async buildImage() {
        console.log(`\n Creating image ${this.image}, please wait...`);
        let result = await TerminalHelper.execute(`docker build --rm -t ${this.image} .`);
        if (!result) {
            let message = `Build docker image ${this.image} failed!`;
            console.log('\n' + message);
            throw new Error(message);
        };
        console.log(`\n Creating image ${this.image} successful!`);
    }

    static async startContainers() {
        for (let i = 0; i < this.containers.length; i++) {
            let container = this.containers[i];
            console.log(`\n Starting container ${container.name}, please wait...`);
            let result = await TerminalHelper.execute(`
                docker run --rm -d --name ${container.name} -p ${container.port} ${this.image}
            `);
            if (!result) {
                let message = `Start docker container ${container.name} failed!`;
                console.log('\n' + message);
                throw new Error(message);
            };
            console.log(`\n Starting container ${container.name} successful!`);
        }
    }
}

async function run() {
    await EngineDocker.removeImage();
    await EngineDocker.stopContainers();
    await EngineDocker.buildImage();
    await EngineDocker.startContainers();
}
run();