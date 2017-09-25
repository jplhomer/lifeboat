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
}
