<template>
  <div :class="{ log: true, 'is-filtered': activeFilters.length }" ref="log">
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AU from "ansi_up";
import { Terminal } from "xterm";
import "xterm/lib/xterm.css";

Terminal.loadAddon("fit");
const xterm = new Terminal();

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
    }
  }
};
</script>

<style scoped>
.log {
  background: var(--black-gradient);
  color: #fff;
  font-size: 0.8em;
  height: 100%;
  overflow-x: auto;
  padding: 1.25rem 1.5rem;
  white-space: pre-wrap;
  word-wrap: normal;
  -webkit-font-smoothing: auto;
  font-family: monospace;
}

.log.is-filtered {
  padding-top: 3.5rem;
}
</style>
