<template>
  <grid>
    <aside class="sidebar__menu" slot="sidebar">
      <ul>
        <li v-for="project in projects" :key="project.id">
          <router-link :to="{ path: `/${project.id}` }" :class="`${project.active ? 'is-active': ''}`">{{ project.name }}</router-link>
        </li>
      </ul>
    </aside>

    <project :project="activeProject" :containers="containers"></project>
  </grid>
</template>

<script>
import { mapGetters } from "vuex";
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
  },
  computed: {
    ...mapGetters(["projects", "activeProject"])
  }
};
</script>

<style>

</style>
