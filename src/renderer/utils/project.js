import DockerConfig from "@/utils/docker-config";
import store from "@/store";

export default class Project {
  constructor(dir, id) {
    this.id = id;
    this.dir = dir;
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
   * Determine whether this project is actively being viewed in the app
   */
  active() {
    return store.state.App.activeProject == this.id;
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
}
