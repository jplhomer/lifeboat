<template>
  <div :class="{ 'log-wrapper': true, 'is-filtered': activeFilters.length }">
    <div class="log" ref="log"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AU from "ansi_up";
import { Terminal } from "xterm";
import "xterm/lib/xterm.css";

Terminal.loadAddon("fit");
const xterm = new Terminal({
  disableStdin: true,
  fontFamily: "monospace",
  fontSize: 13,
  lineHeight: 1.3,
  theme: {
    background: "#0a0a0a"
  }
});

export default {
  props: ["project"],
  computed: {
    logs() {
      return this.$store.getters.projectLogs(this.project.id);
    },
    logOutput() {
      let logs = this.logs.trim().split("\n");

      if (this.activeFilters.length) {
        const regex = new RegExp(`(${this.activeFilters.join("|")})_`);
        logs = logs.filter(l => regex.test(l.trim()));
      }

      return logs.join("\n");
    },
    activeTab() {
      return this.projectActiveTab(this.project.id);
    },
    activeFilters() {
      return this.projectLogFilters(this.project.id);
    },
    activeFilterString() {
      return this.activeFilters.join();
    },
    ...mapGetters(["projectActiveTab", "projectLogFilters"])
  },
  mounted() {
    xterm.open(this.$refs.log);
    xterm.fit();
    xterm.write(this.logs);

    window.addEventListener("resize", () => {
      xterm.fit();
      xterm.refresh();
    });
  },
  watch: {
    logOutput(val) {
      xterm.write(val);
    },
    $route() {
      xterm.clear();
    },
    activeFilterString(val) {
      xterm.clear();
      xterm.fit();
    }
  }
};
</script>

<style scoped>
.log-wrapper {
  background: #0a0a0a;
  color: #fff;
  font-size: 0.8em;
  height: 100%;
  padding: 1.25rem 0 1.25rem 1.5rem;
  width: 100%;
}

.log-wrapper.is-filtered {
  padding-top: 3.5rem;
}

.log {
  height: 100%;
  width: 100%;
}
</style>
