const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

export default class DockerConfig {
  /**
   * Create a new DockerConfig instance by passing the project directory.
   * @param {Object} Project data
   */
  constructor(project) {
    const { dir } = project;
    this.watchers = [];
    this.dir = dir;
    this.composeFile = this.getComposeFile();

    if (this.composeFile) {
      this.data = loadData.call(this);
      watchForChanges.call(this);
    }
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

  /**
   * Get the compose file for this project
   */
  getComposeFile() {
    return [
      "docker-compose.yml",
      "docker-compose.yaml"
    ].reduce((match, file) => {
      if (match) return match;

      // Check to see if the file exists
      try {
        const stats = fs.statSync(path.join(this.dir, file));

        // Set the file as a match
        if (stats.isFile()) match = file;
      } catch (e) {}

      return match;
    }, null);
  }
}

function loadData() {
  try {
    const path = `${this.dir}/${this.composeFile}`;
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
    fs.watch(`${this.dir}/${this.composeFile}`, {}, () => {
      this.data = loadData.call(this);
      this.watchers.forEach(m => m.call());
    });
  }
}
