import * as Client from 'dockerode'
import which from 'which';
import child_process from 'child_process';

const client = new Client({ socketPath: '/var/run/docker.sock' })

export default class Docker {
  constructor() {
    console.log('starting Docker...')
  }

  startProject(dir) {
    console.log('ok doing it');

    return new Promise((resolve, reject) => {
      child_process.execFile(which.sync('docker-compose'), ['up', '-d'], { cwd: dir }, (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }

  listContainers() {
    return client.listContainers()
  }
}
