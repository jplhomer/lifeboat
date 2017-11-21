<template>
  <div class="log" v-html="logOutput" ref="scrollToBottom">
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AU from "ansi_up";
import scrollToBottom from "@/mixins/scroll-to-bottom";

const ansi_up = new AU();
let logger;

export default {
  props: ["project"],
  mixins: [scrollToBottom],
  computed: {
    logs() {
      return this.$store.getters.projectLogs(this.project.id);
    },
    logOutput() {
      let logs = this.logs.split("\n");

      if (this.activeFilters.length) {
        const regex = new RegExp(`(${this.activeFilters.join("|")})_`);
        logs = logs.filter(l => regex.test(l.trim()));
      }

      return ansi_up.ansi_to_html(logs.join("\n"));
    },
    activeTab() {
      return this.projectActiveTab(this.project.id);
    },
    activeFilters() {
      return this.projectLogFilters(this.project.id);
    },
    ...mapGetters(["activeProject", "projectActiveTab", "projectLogFilters"])
  },
  watch: {
    logs() {
      this.scrollToBottom();
    },
    activeProject(newProjectId) {
      if (newProjectId == this.project.id) {
        this.scrollToBottom();
      }
    },
    activeTab(newTab) {
      if (newTab === "logs") {
        this.scrollToBottom();
      }
    },
    activeFilters() {
      this.scrollToBottom();
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
</style>
