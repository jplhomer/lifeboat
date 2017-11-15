const yaml = require("js-yaml");
const fs = require("fs");

export default class DockerConfig {
  constructor(project) {
    const { dir, name } = project;
    this.watchers = [];
    this.dir = dir;
    this.name = name;
    this.data = loadData.call(this);
    watchForChanges.call(this);
  }

  /**
   * Fire a method when the Compose file changes
   * @param {Closure} method
   */
  onChange(method) {
    this.watchers.push(method);
  }

  /**
   * Get prefixed versions of service names
   */
  services() {
    if (!this.data) {
      return [];
    }

    return Object.keys(this.data.services).sort();
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

/**
 * Watch for changes to the Compose file, and fire callbacks on change.
 */
function watchForChanges() {
  if (this.data) {
    fs.watch(`${this.dir}/docker-compose.yml`, {}, () => {
      this.data = loadData.call(this);
      this.watchers.forEach(m => m.call());
    });
  }
}
