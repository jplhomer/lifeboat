<template>
  <grid>
    <aside class="sidebar__menu" slot="sidebar">
      <ul>
        <li v-for="project in projects" :key="project.id">
          <router-link :to="{ path: `/${project.id}` }">{{ project.dirName }}</router-link>
        </li>
      </ul>
    </aside>

    <div class="sidebar__actions" slot="sidebar">
      <router-link to="settings" class="icon is-medium" title="Settings">
        <i class="fa fa-lg fa-cog"></i>
      </router-link>
    </div>

    <project :project="activeProject"></project>
  </grid>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Grid from "./Grid";
import Project from "./Dashboard/Project";
import Container from "../utils/docker-container";

export default {
  name: "landing-page",
  components: { Grid, Project },
  methods: {
    ...mapActions(["fetchContainers", "listenForContainerUpdates"])
  },
  created() {
    this.fetchContainers();
    this.listenForContainerUpdates();
  },
  computed: {
    ...mapGetters(["projects", "activeProject"])
  },
  watch: {
    /**
     * We have to watch Router changes manually, since we're using dynamic
     * route binding.
     */
    $route(to, from) {
      this.$store.commit("UPDATE_ACTIVE_PROJECT", to.params.project_id);
    }
  }
};
</script>

<style>

</style>
