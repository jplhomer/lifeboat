import * as Client from "dockerode";
import which from "which";
import child_process from "child_process";

const client = new Client({ socketPath: "/var/run/docker.sock" });

export default class Docker {
  /**
   * Start a Docker Compose project
   * @param {string} dir
   */
  startProject(dir) {
    return compose.call(this, dir, ["up", "-d"]);
  }

  /**
   * Stop a Docker Compose project
   * @param {string} dir
   */
  stopProject(dir) {
    return compose.call(this, dir, ["down"]);
  }

  /**
   * List containers in Docker
   */
  static listContainers() {
    return client.listContainers({ all: true });
  }

  logs(dir) {
    return child_process.spawn("docker-compose", ["logs", "-f"], { cwd: dir });
  }

  run(dir, service, commands) {
    return child_process.spawn(
      "docker-compose",
      ["run", "--rm", service, ...commands],
      { cwd: dir }
    );
  }

  /**
   * Listen to Docker events on the system
   * @param {closure} cb
   */
  static listen(cb) {
    client.getEvents((error, stream) => {
      if (error || !stream) {
        return;
      }

      stream.setEncoding("utf8");
      stream.on("data", json => {
        try {
          let data = JSON.parse(json);

          cb(data);
        } catch (e) {
          console.log(e);
        }
      });
    });
  }
}

/**
 * Run docker-compose in a given directory
 * @param {string} dir
 * @param {array} args
 */
function compose(dir, args = []) {
  return new Promise((resolve, reject) => {
    child_process.execFile(
      which.sync("docker-compose"),
      args,
      { cwd: dir },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout || stderr);
        }
      }
    );
  });
}
