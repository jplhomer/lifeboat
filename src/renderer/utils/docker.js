const Client = require("dockerode");
import DockerCompose from "./docker-compose";

class Docker {
  /**
   * Creates a new Docker helper.
   */
  constructor() {
    this.client = new Client({
      socketPath:
        process.platform === "win32"
          ? "//./pipe/docker_engine"
          : "/var/run/docker.sock"
    });
  }
  /**
   * Start a Docker Compose project
   * @param {string} dir
   */
  startProject(dir) {
    return DockerCompose.sync(dir, ["up", "-d"]);
  }

  /**
   * Builds a Docker Compose project
   * @param {string} dir
   */
  buildProject(dir) {
    return DockerCompose.sync(dir, ["build"]);
  }

  /**
   * Stop a Docker Compose project
   * @param {string} dir
   */
  stopProject(dir) {
    return DockerCompose.sync(dir, ["down"]);
  }

  /**
   * Restart a Docker Compose project
   * @param {string} dir
   */
  restartProject(dir) {
    return DockerCompose.sync(dir, ["restart"]);
  }

  /**
   * List containers in Docker
   */
  listContainers() {
    return this.client.listContainers({ all: true });
  }

  logs(dir) {
    return DockerCompose.sync(dir, ["logs", "-f", "--tail=100"]);
  }

  run(dir, service, commands) {
    return DockerCompose.sync(dir, ["run", "--rm", service, ...commands]);
  }

  /**
   * Listen to Docker events on the system
   * @param {closure} cb
   */
  listen(cb) {
    this.client.getEvents((error, stream) => {
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

export default new Docker();
