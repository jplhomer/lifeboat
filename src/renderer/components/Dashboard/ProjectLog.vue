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
  props: ["project", "logs"],
  mixins: [scrollToBottom],
  data() {
    return {
      isScrolledUp: false
    };
  },
  computed: {
    logOutput() {
      return ansi_up.ansi_to_html(this.logs);
    },
    ...mapGetters(["activeProject"])
  },
  watch: {
    logs() {
      this.scrollToBottom();
    },
    activeProject(newProjectId) {
      if (newProjectId == this.project.id) {
        this.scrollToBottom();
      }
    }
  }
};
</script>

<style scoped>
.log {
  background: #050505;
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
