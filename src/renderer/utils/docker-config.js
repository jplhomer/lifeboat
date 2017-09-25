const yaml = require("js-yaml");
const fs = require("fs");

export default class DockerConfig {
  constructor(opts) {
    const { dir, name } = opts;
    this.dir = dir;
    this.name = name;
    this.data = loadData.call(this);
  }

  /**
   * Get prefixed versions of service names
   */
  serviceNames() {
    return Object.keys(this.data.services);
  }
}

function loadData() {
  try {
    const path = `${this.dir}/docker-compose.yml`;
    return yaml.safeLoad(fs.readFileSync(path, "utf8"));
  } catch (e) {
    console.log(e);
  }
}
