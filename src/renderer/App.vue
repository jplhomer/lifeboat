<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import settings from "./utils/settings";

export default {
  computed: {
    ...mapGetters(["projects"])
  },
  created() {
    // Send to Settings page if no projects
    if (!this.projects.length) {
      this.$router.push("/settings");
      return;
    }
  }
};
</script>
