import DockerConfig from "@/utils/docker-config";
import store from "@/store";

export default class Project {
  constructor(dir, id) {
    this.id = id;
    this.dir = dir;
    this.config = new DockerConfig(this);
  }

  get dirName() {
    return this.dir.split("/").pop();
  }

  get name() {
    return this.dir
      .split("/")
      .pop()
      .replace(/-/g, "");
  }

  active() {
    return store.state.App.activeProject == this.id;
  }
}
