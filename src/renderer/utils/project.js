import DockerConfig from "@/utils/docker-config";
import settings from "electron-settings";
import store from "@/store";

const SEP = process.platform === "win32" ? "\\" : "/";

export default class Project {
  constructor(data, id) {
    this.id = id;

    // Support legacy projects which are just strings
    if (typeof data === "string") {
      this.dir = data;
    } else {
      this.dir = data.dir;
    }

    this.config = new DockerConfig(this);
  }

  /**
   * Get the final name of the directory where the project lives
   */
  get dirName() {
    return this.dir.split(SEP).pop();
  }

  /**
   * Get the name of the app, formatted for Docker consumption
   */
  get name() {
    return this.dir
      .split(SEP)
      .pop()
      .replace(/-/g, "");
  }

  /**
   * Get the names of services associated with this project
   */
  services() {
    return this.config.services();
  }

  /**
   * Get the containers associated with this project
   */
  containers() {
    return store.state.App.containers
      .filter(c => c.project === this.name)
      .filter(c => !c.temp)
      .filter(c => this.services().includes(c.service));
  }

  /**
   * Determine whether this project is running.
   */
  running() {
    return this.services().every(s =>
      this.containers().find(c => c.service === s && c.state === "running")
    );
  }

  /**
   * Determine whether this project is partially running.
   */
  partiallyRunning() {
    return this.services().some(s =>
      this.containers().find(c => c.service === s && c.state === "running")
    );
  }

  /**
   * Get the status string of a project.
   */
  status() {
    if (this.running()) {
      return "running";
    }

    if (this.partiallyRunning()) {
      return "partial";
    }

    return "stopped";
  }

  /**
   * Get data suitable for storing
   */
  toJson() {
    return {
      id: this.id,
      dir: this.dir
    };
  }
}
