const Client = require("dockerode");
import DockerCompose from "./docker-compose";

const client = new Client({ socketPath: "/var/run/docker.sock" });

export default class Docker {
  /**
   * Start a Docker Compose project
   * @param {string} dir
   */
  startProject(dir, vars = []) {
    const env = parseVariables(vars);
    return DockerCompose.async(dir, ["up", "-d"], env);
  }

  /**
   * Stop a Docker Compose project
   * @param {string} dir
   */
  stopProject(dir) {
    return DockerCompose.async(dir, ["down"]);
  }

  /**
   * Restart a Docker Compose project
   * @param {string} dir
   */
  restartProject(dir) {
    return DockerCompose.async(dir, ["restart"]);
  }

  /**
   * List containers in Docker
   */
  static listContainers() {
    return client.listContainers({ all: true });
  }

  logs(dir) {
    return DockerCompose.sync(dir, ["logs", "-f"]);
  }

  run(dir, service, commands, vars = []) {
    const env = parseVariables(vars);
    return DockerCompose.sync(dir, ["run", "--rm", service, ...commands], env);
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
 * Return an object of key/value pairs from an array of project variables
 * @param {Array} vars
 */
function parseVariables(vars) {
  if (!vars.length) {
    return {};
  }

  return vars.reduce((memo, v) => {
    memo[v.key] = v.value;
    return memo;
  }, {});
}
