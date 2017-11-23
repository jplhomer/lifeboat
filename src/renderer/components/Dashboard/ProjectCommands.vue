<template>
  <div class="commands" ref="scrollToBottom">
    <div class="commands__bar">
      <div class="field has-addons">
        <div class="control">
          <div class="select">
            <select v-model="service" class="select">
              <option v-for="option in services" :value="option" :key="option">{{ option }}</option>
            </select>
          </div>
        </div>
        <div class="control is-expanded">
          <input v-model="command" class="command-text input" type="text" @keyup.enter="run(project.id)" @keydown.up="loadPreviousCommand(project.id)" @keydown.down="loadNextCommand(project.id)" :placeholder="`Type a command to run in ${service}...`">
        </div>
        <div class="control">
          <button @click.prevent="run(project.id)" class="button">Run</button>
        </div>
        <div class="control">
          <button @click.prevent="cancel(project.id)" class="button is-danger" v-show="running(project.id)">Cancel</button>
        </div>
      </div>
    </div>
    <div class="commands__log" ref="terminal"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { Terminal } from "xterm";
import "xterm/lib/xterm.css";
import _ from "lodash";

Terminal.loadAddon("fit");
let xterm;
let process;

export default {
  props: ["project"],
  methods: {
    createTerminalInstance() {
      xterm = new Terminal({
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 1.3,
        cursorBlink: true,
        theme: {
          background: "#0a0a0a"
        }
      });
      xterm.open(this.$refs.terminal);
      xterm.fit();
      xterm.prompt = function() {
        xterm.write(`\r\n$ `);
      };

      xterm.writeln("Type any command to run inside app");
      xterm.prompt();
      this.handleTerminalInput();
    },

    handleTerminalInput() {
      var self = this;

      xterm.on("key", function(key, ev) {
        if (self.running(self.project.id)) {
          self.$store.dispatch("ProjectCommand/sendKey", {
            id: self.project.id,
            key
          });
          return;
        }

        if (ev.keyCode === 13) {
          xterm.clear();
          xterm.writeln("");
          self.run(self.project.id).then(p => {
            p.on("data", function(data) {
              xterm.write(data);
            });

            p.on("exit", function() {
              xterm.prompt();
            });
          });
        } else {
          xterm.write(key);
          self.command += key;
        }
      });
    },

    ...mapActions("ProjectCommand", [
      "run",
      "cancel",
      "loadPreviousCommand",
      "loadNextCommand"
    ])
  },
  computed: {
    services() {
      return this.project.services;
    },

    logOutput() {
      return this.logs(this.project.id);
    },

    service: {
      get() {
        return this.$store.getters["ProjectCommand/service"](this.project.id);
      },

      set(service) {
        this.$store.dispatch("ProjectCommand/setService", {
          id: this.project.id,
          service
        });
      }
    },

    command: {
      get() {
        return this.$store.getters["ProjectCommand/command"](this.project.id);
      },

      set(command) {
        this.$store.dispatch("ProjectCommand/setCommand", {
          id: this.project.id,
          command
        });
      }
    },

    activeTab() {
      return this.projectActiveTab(this.project.id);
    },

    ...mapGetters("ProjectCommand", ["logs", "running"]),
    ...mapGetters(["projectActiveTab"])
  },
  created() {
    if (!this.service) this.service = this.services[0];
  },
  mounted() {},
  watch: {
    $route() {
      if (!this.service) this.service = this.services[0];
    },
    activeTab(val) {
      if (val === "commands") {
        if (!xterm) this.createTerminalInstance();
        xterm.focus();
      }
    },
    logOutput() {
      // if (xterm) {
      //   xterm.clear();
      //   xterm.write(this.logOutput);
      // }
    }
  }
};
</script>

<style lang="scss" scoped>
.input,
.button,
.field,
select {
  border-radius: 0 !important;
}

.commands {
  background: #0a0a0a;
  height: 100%;
  padding: 1rem 1rem 2.5rem;
  width: 100%;

  &__bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &__log {
    height: 100%;
    width: 100%;
  }
}

.command-text {
  font-family: monospace;
}
</style>
