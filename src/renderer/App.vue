<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import settings from "./utils/settings";

export default {
  created() {
    this.$store.commit("LOAD_INITIAL_PROJECTS", settings.load().projects || []);

    // Send to Settings page if no projects
    if (!this.$store.state.Settings.projects.length) {
      this.$router.push("/settings");
      return;
    }

    // Set the active project that might exist in the URL
    if (this.$router.currentRoute.params.project_id) {
      this.$store.commit(
        "UPDATE_ACTIVE_PROJECT",
        this.$router.currentRoute.params.project_id
      );
    }
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Libre+Franklin:300,400,400i,700,700i');

body {
  font-family: 'Libre Franklin', sans-serif;
}
</style>
