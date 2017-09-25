export default class DockerContainer {
  constructor(container) {
    this.container = container;
  }

  /**
   * Get the name of a container, sans starting slash
   */
  get name() {
    return this.container.Names[0].slice(1);
  }

  get image() {
    return this.container.Image;
  }

  get project() {
    return this.container.Labels["com.docker.compose.project"];
  }

  get serviceName() {
    return this.container.Labels["com.docker.compose.service"];
  }

  get id() {
    return this.container.Id;
  }
}
