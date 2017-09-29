<template>
  <div class="log" v-html="logOutput" ref="log"></div>
</template>

<script>
import { mapGetters } from "vuex";
import AU from "ansi_up";
import Vue from "vue";
import events from "@/utils/events";

const ansi_up = new AU();
let logger;

export default {
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
    ...mapGetters(["activeProject"])
  },
  methods: {
    addLogs(logs) {
      this.logs += logs;
      this.scrollToBottom();
    },
    startLogger() {
      this.logs = "";

      logger = this.$docker.logs(this.activeProject.dir);
      logger.stdout.on("data", data => {
        this.addLogs(data.toString());
      });
    },
    killLogger() {
      if (logger) logger.kill();
    },
    scrollToBottom() {
      if (this.isScrolledUp) {
        return;
      }
      Vue.nextTick(() => {
        this.$refs.log.scrollTop =
          this.$refs.log.scrollHeight - this.$refs.log.offsetHeight;
      });
    }
  },
  created() {
    this.startLogger();

    events.$on("PROJECT_STARTED", () => {
      setTimeout(this.startLogger, 2000);
    });
  },
  mounted() {
    this.$refs.log.addEventListener("scroll", () => {
      this.isScrolledUp =
        this.$refs.log.scrollTop !=
        this.$refs.log.scrollHeight - this.$refs.log.offsetHeight;
    });
  },
  beforeDestroy() {
    this.killLogger();
  },
  watch: {
    $route(to, from) {
      this.killLogger();
      this.logs = "";

      this.startLogger();
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
  white-space: pre;
  word-wrap: normal;
  -webkit-font-smoothing: auto;
  font-family: monospace;
}
</style>
