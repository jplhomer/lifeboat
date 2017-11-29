<template>
  <div :class="{ 'log-wrapper': true, 'is-filtered': activeFilters.length }">
    <div class="log" ref="log"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { Terminal } from "xterm";
import * as types from "@/store/mutation-types";
import "xterm/lib/xterm.css";
import _ from "lodash";

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

  data() {
    return {
      skipNextLogUpdate: false
    };
  },

  computed: {
    logs() {
      return this.$store.getters.projectLogs(this.project.id);
    },

    logOutput() {
      if (!this.activeFilters.length) return this.logs;

      let logs = this.logs.split("\n");

      const regex = new RegExp(`(${this.activeFilters.join("|")})_`);
      logs = logs.filter(l => regex.test(l.trim()));

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

    isLogging() {
      return this.projectLogging(this.project.id);
    },

    ...mapGetters([
      "projectActiveTab",
      "projectLogFilters",
      "projectLogging",
      "projectLogProcess"
    ])
  },

  methods: {
    attachToLogs() {
      const p = this.projectLogProcess(this.project.id);

      if (!p) return;

      p.on("data", d => xterm.write(d));
    }
  },

  mounted() {
    xterm.open(this.$refs.log);
    xterm.fit();
    xterm.write(this.logOutput);

    this.$store.subscribe((mutation, state) => {
      if (
        mutation.type === types.CLEAR_PROJECT_LOGS &&
        mutation.payload == this.project.id
      ) {
        xterm.reset();
      }
    });

    window.addEventListener(
      "resize",
      _.debounce(() => {
        xterm.fit();
        xterm.reset();
        xterm.write(this.logOutput);
      }, 200)
    );
  },

  watch: {
    $route() {
      xterm.reset();
      xterm.write(this.logOutput);
      this.skipNextLogUpdate = true;
    },

    logOutput(val) {
      if (this.skipNextLogUpdate) {
        this.skipNextLogUpdate = false;
        return;
      }

      xterm.write(val);
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
  padding: 1rem 0 1rem 1rem;
  width: 100%;
}

.log-wrapper.is-filtered {
  padding-top: 2rem;
}

.log {
  height: 100%;
  width: 100%;
}
</style>
