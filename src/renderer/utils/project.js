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
   * Get data suitable for storing
   */
  toJson() {
    return {
      id: this.id,
      dir: this.dir
    };
  }
}
