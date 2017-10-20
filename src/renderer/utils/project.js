import DockerConfig from "@/utils/docker-config";
import store from "@/store";
import settings from "electron-settings";

export default class Project {
  constructor(data, id) {
    this.id = id;

    // Support legacy projects which are just strings
    if (typeof data === "string") {
      this.dir = data;
    } else {
      this.dir = data.dir;
      this._variables = data.variables;
    }

    this.config = new DockerConfig(this);
  }

  /**
   * Get the final name of the directory where the project lives
   */
  get dirName() {
    return this.dir.split("/").pop();
  }

  /**
   * Get the name of the app, formatted for Docker consumption
   */
  get name() {
    return this.dir
      .split("/")
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
   * Get the ENV variables for this project
   */
  get variables() {
    return this._variables || [];
  }

  /**
   * Set the ENV variables for this project
   */
  set variables(value) {
    this._variables = value;
    this.save();
  }

  /**
   * Returns an object fit for saving into settings
   */
  formatForSettings() {
    return {
      dir: this.dir,
      variables: this.variables
    };
  }

  /**
   * Save a given project to the settings
   */
  save() {
    let projects = Object.assign([], store.getters.projects);
    projects[this.id] = this.formatForSettings();
    settings.set("projects", projects);
    // store.commit("UPDATE_SETTING", {
    //   key: "projects",
    //   value: projects
    // });
  }
}
