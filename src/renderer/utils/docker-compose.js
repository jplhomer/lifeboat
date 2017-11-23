import { execFile, spawn } from "child_process";
import * as pty from "node-pty";

export default class DockerCompose {
  /**
   * Execute a Docker Compose command, and return a ChildProcess.
   * @param {string} dir
   * @param {array} args
   */
  static sync(dir, args = []) {
    return pty.spawn("docker-compose", args, {
      name: "xterm-color",
      cwd: dir
    });
  }

  /**
   * Execute a Docker Compose command, and return a Promise
   * @param {string} dir
   * @param {array} args
   */
  static async(dir, args = []) {
    return new Promise((resolve, reject) => {
      execFile(
        which.sync("docker-compose", { path: "/usr/local/bin" }),
        ["-f", `${dir}/docker-compose.yml`].concat(args),
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
          }

          // Docker Compose ships its status logs to stderr.
          // Weird, right? https://github.com/docker/compose/issues/5296
          resolve(stdout || stderr);
        }
      );
    });
  }
}
