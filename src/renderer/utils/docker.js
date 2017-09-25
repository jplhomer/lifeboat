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

  listen() {
    this.client.getEvents((error, stream) => {
      if (error || !stream) {
        return;
      }

      stream.setEncoding('utf8');
      stream.on('data', json => {
        let data = JSON.parse(json);

        if (data.status === 'pull' || data.status === 'untag' || data.status === 'delete' || data.status === 'attach') {
          // this.refresh();
        }

        if (data.status === 'destroy') {

          // this.detachLog()
        } else if (data.status === 'kill') {

          // this.detachLog(/)
        } else if (data.status === 'stop') {
          // this.detachLog()
        } else if (data.status === 'create') {
          // this.logs();
          // this.fetchContainer(data.id);
        } else if (data.status === 'start') {
          // this.attach();
          // this.fetchContainer(data.id);
        } else if (data.id) {
          // this.fetchContainer(data.id);
        }

        if (data.Type === 'network') {
          let action = data.Action;
          if (action === 'connect' || action === 'disconnect') {
            // do not fetch container while networks updating via Kitematic
            // if (!networkStore.getState().pending) {
            //   this.fetchContainer(data.Actor.Attributes.container);
            // }
          } else if (action === 'create' || action === 'destroy') {
            // this.fetchAllNetworks();
          }
        }
      });
    });
  }
}
