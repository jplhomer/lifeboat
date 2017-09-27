import router from "@/router";

export default class Project {
  constructor(dir, id) {
    this.id = id;
    this.dir = dir;
  }

  get name() {
    return this.dir.split("/").pop();
  }

  get active() {
    const { currentRoute } = router;
    return (
      (currentRoute.params.project_id &&
        currentRoute.params.project_id === this.id) ||
      this.id === 0
    );
  }
}
