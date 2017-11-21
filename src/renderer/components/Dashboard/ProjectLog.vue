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
      return ansi_up.ansi_to_html(this.logs);
    },
    activeTab() {
      return this.projectActiveTab(this.project.id);
    },
    ...mapGetters(["activeProject", "projectActiveTab"])
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
