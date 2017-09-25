import * as Client from "dockerode";
import which from "which";
import child_process from "child_process";

const client = new Client({ socketPath: "/var/run/docker.sock" });

export default class Docker {
  constructor() {
    console.log("starting Docker...");
  }

  startProject(dir) {
    return new Promise((resolve, reject) => {
      child_process.execFile(
        which.sync("docker-compose"),
        ["up", "-d"],
        { cwd: dir },
        (error, stdout) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        }
      );
    });
  }

  listContainers() {
    return client.listContainers();
  }

  listen(cb) {
    client.getEvents((error, stream) => {
      if (error || !stream) {
        return;
      }

      stream.setEncoding("utf8");
      stream.on("data", json => {
        let data = JSON.parse(json);

        cb(data);
      });
    });
  }
}
