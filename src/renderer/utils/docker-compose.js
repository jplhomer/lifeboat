import { execFile } from "child_process";
import which from "which";

export default class DockerCompose {
  /**
   * Execute a Docker Compose command, and return a ChildProcess.
   * @param {string} dir
   * @param {array} args
   */
  static sync(dir, args = [], env = {}) {
    return execFile(
      which.sync("docker-compose", { path: "/usr/local/bin", env }),
      ["-f", `${dir}/docker-compose.yml`].concat(args)
    );
  }

  /**
   * Execute a Docker Compose command, and return a Promise
   * @param {string} dir
   * @param {array} args
   */
  static async(dir, args = [], env = {}) {
    console.log(env);
    return new Promise((resolve, reject) => {
      execFile(
        which.sync("docker-compose", { path: "/usr/local/bin", env }),
        ["-f", `${dir}/docker-compose.yml`].concat(args),
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
          }

          resolve(stdout || stderr);
        }
      );
    });
  }
}
