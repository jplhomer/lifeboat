<template>
  <div class="log" v-html="logOutput" ref="scrollToBottom">
  </div>
</template>

<script>
import { mapState } from "vuex";
import AU from "ansi_up";
import events from "@/utils/events";
import scrollToBottom from "@/mixins/scroll-to-bottom";

const ansi_up = new AU();
let logger;

export default {
  props: ["project"],
  mixins: [scrollToBottom],
  data() {
    return {
      logs: "",
      isScrolledUp: false
    };
  },
  computed: {
    logOutput() {
      return ansi_up.ansi_to_html(this.logs);
    },
    ...mapState({
      activeProject: state => state.App.activeProject
    })
  },
  methods: {
    addLogs(logs) {
      this.logs += logs;
      this.scrollToBottom();
    },
    startLogger() {
      this.logs = "";

      logger = this.$docker.logs(this.project.dir);
      logger.stdout.on("data", data => {
        this.addLogs(data.toString());
      });
    },
    killLogger() {
      if (logger) logger.kill();
    }
  },
  created() {
    this.startLogger();

    events.$on("PROJECT_STARTED", () => {
      setTimeout(this.startLogger, 2000);
    });
  },
  beforeDestroy() {
    this.killLogger();
  },
  watch: {
    activeProject(newProject) {
      if (newProject == this.project) {
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
  font-size: .8em;
  height: 100%;
  overflow-x: auto;
  padding: 1.25rem 1.5rem;
  white-space: pre-wrap;
  word-wrap: normal;
  -webkit-font-smoothing: auto;
  font-family: monospace;
}
</style>
