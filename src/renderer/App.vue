<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import settings from "./utils/settings";

export default {
  created() {
    // Send to Settings page if no projects
    if (!this.$store.state.Settings.projects.length) {
      this.$router.push("/settings");
      return;
    }
  }
};
</script>
