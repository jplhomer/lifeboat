<template>
  <grid>
    <aside class="sidebar__menu" slot="sidebar">
      <ul>
        <li v-for="project in projects">
          <a href="#">{{ projectName(project) }}</a>
        </li>
      </ul>
    </aside>

    <project name="zonemeals" dir="/Users/jplhomer/Documents/Apps/zonemeals" :containers="containers"></project>
  </grid>
</template>

<script>
import { mapState } from "vuex";
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
    },

    projectName(project) {
      return project.split("/").pop();
    }
  },
  created() {
    this.fetchContainers();

    // Listen to any status updates from Docker
    this.$docker.listen(data => {
      this.fetchContainers();
    });
  },
  computed: mapState({
    projects: state => state.Settings.projects
  })
};
</script>

<style>

</style>
