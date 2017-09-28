<template>
  <pre class="log" v-html="logOutput" ref="log"></pre>
</template>

<script>
import { mapGetters } from "vuex";
import ansiHTML from "ansi-html";
import Vue from "vue";
import events from "@/utils/events";

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
      return ansiHTML(this.logs);
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
      setTimeout(this.startLogger, 1000);
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
pre {
  background: #050505;
  font-size: .8em;
  height: 100%;
}
</style>
