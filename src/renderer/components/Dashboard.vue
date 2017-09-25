<template>
  <grid>
    <aside class="menu" slot="sidebar">
      <p class="menu-label">Projects</p>
      <ul class="menu-list">
        <li>
          <a class="is-active" href="#">zonemeals</a>
        </li>
        <li>
          <a href="#">intranet</a>
        </li>
        <li>
          <a href="#">intranet</a>
        </li>
      </ul>
    </aside>

    <project name="zonemeals" dir="/Users/jplhomer/Documents/Apps/zonemeals" :containers="containers"></project>
  </grid>
</template>

<script>
import Grid from "./Grid";
import Project from "./Dashboard/Project";
import Container from "../utils/docker-container";

export default {
  name: "landing-page",
  components: { Grid, Project },
  data() {
    return {
      containers: []
    };
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link);
    },

    fetchContainers() {
      this.$docker.listContainers().then(containers => {
        this.containers = containers.map(c => new Container(c));
      });
    }
  },
  created() {
    this.fetchContainers();

    // Listen to any status updates from Docker
    this.$docker.listen(data => {
      this.fetchContainers();
    });
  }
};
</script>

<style>

</style>
