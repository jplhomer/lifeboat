<template>
  <div id="app" :class="`platform-${platform}`">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ipcRenderer } from "electron";

export default {
  data() {
    return {
      platform: process.platform
    };
  },
  computed: {
    ...mapGetters(["projects"])
  },
  created() {
    // Send to Settings page if no projects
    if (!this.projects.length) {
      this.$router.push("/settings");
    }

    // Ensure projects are using correct schema
    this.$store.dispatch("migrateProjectSchema");

    // Check for available updates
    ipcRenderer.on("autoupdate-update-downloaded", () => {
      this.$store.commit("MARK_UPDATE_AVAILABLE", true);
    });

    ipcRenderer.on("autoupdate-update-not-available", () => {
      this.$store.commit("MARK_UPDATE_AVAILABLE", false);
    });

    // Run an initial check
    ipcRenderer.send("autoupdate-check", true);
  }
};
</script>
