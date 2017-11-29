import * as pty from "node-pty";
import store from "@/store";

export default class DockerCompose {
  /**
   * Execute a Docker Compose command, and return a ChildProcess.
   * @param {string} dir
   * @param {array} args
   */
  static sync(dir, args = []) {
    return pty.spawn("docker-compose", args, {
      name: "xterm-color",
      cwd: dir,
      cols: store.state.Project.projectCols,
      rows: store.state.Project.projectrows
    });
  }
}
