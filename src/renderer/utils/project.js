import store from "@/store";

export default class Project {
  constructor(dir, id) {
    this.id = id;
    this.dir = dir;
  }

  get name() {
    return this.dir.split("/").pop();
  }

  active() {
    return store.state.App.activeProject == this.id;
  }
}
