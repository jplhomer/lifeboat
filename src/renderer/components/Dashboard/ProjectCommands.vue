<template>
  <div class="commands">
    <div class="commands__terminal" ref="terminal"></div>
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
        fontSize: 14,
        lineHeight: 1.3,
        cursorBlink: true,
        theme: {
          background: "#0a0a0a"
        }
      });
      xterm.open(this.$refs.terminal);
      xterm.fit();

      this.welcome();
      this.handleTerminalInput();

      window.addEventListener(
        "resize",
        _.debounce(() => {
          if (this.activeTab !== "commands") return;
          xterm.fit();
        }, 200)
      );

      xterm.on("resize", e => {
        // Let the Project store know, so new Processes use the correct size
        this.$store.dispatch("projectResizeTerminal", e);

        // Let the ProjectCommand store know, so it can resize the current process
        this.resize(e);
      });
    },

    handleTerminalInput() {
      xterm.on("key", this.handleKey);
      xterm.on("paste", d => {
        xterm.write(d);

        // Send straight to process if running,
        // Otherwise add to the command
        if (this.isRunning) {
          this.$store.dispatch("ProjectCommand/sendKey", {
            id: this.project.id,
            key: d
          });
        } else {
          this.command += d;
        }
      });
    },

    async handleKey(key, ev) {
      const printable =
        !ev.altKey &&
        !ev.altGraphKey &&
        !ev.ctrlKey &&
        !ev.metaKey &&
        !/arrow|tab/i.test(ev.key);

      if (this.isRunning) {
        this.$store.dispatch("ProjectCommand/sendKey", {
          id: this.project.id,
          key
        });

        return;
      }

      // Enter
      if (ev.keyCode === 13) {
        xterm.clear();
        xterm.writeln("");
        this.run(this.project.id);

        return;
      }

      // Backspace
      if (ev.keyCode === 8) {
        if (xterm.buffer.x > this.promptString.length) {
          xterm.write("\b \b");
          this.command = this.command.slice(0, this.command.length - 1);
        }

        return;
      }

      if (printable) {
        xterm.write(key);
        this.command += key;
      }
    },

    prompt() {
      xterm.write(`\r\n\u001b[1m${this.promptString}\u001b[22m${this.command}`);
    },

    welcome() {
      if (this.running(this.project.id)) {
        xterm.write(this.logs(this.project.id));
      } else {
        xterm.write("Type any command to run inside the selected service\r\n");
        this.prompt();
      }
    },

    ...mapActions("ProjectCommand", [
      "run",
      "cancel",
      "loadPreviousCommand",
      "loadNextCommand",
      "getProcess",
      "resize"
    ])
  },
  computed: {
    services() {
      return this.project.services;
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

    promptString() {
      return `${this.service} $ `;
    },

    logOutput() {
      return this.logs(this.project.id);
    },

    isRunning() {
      return this.running(this.project.id);
    },

    ...mapGetters("ProjectCommand", ["running", "process", "logs"]),
    ...mapGetters(["projectActiveTab"])
  },
  mounted() {
    // In case this tab is loaded after the Settings route
    if (!xterm && this.activeTab === "commands") {
      this.createTerminalInstance();
    }

    if (xterm) xterm.focus();
  },
  created() {
    if (!this.service) this.service = this.services[0];
  },
  watch: {
    $route() {
      if (!this.service) this.service = this.services[0];
      if (xterm) {
        xterm.reset();
        this.welcome();

        if (this.activeTab === "commands") {
          xterm.focus();
        }
      }
    },

    activeTab(val) {
      if (val === "commands") {
        if (!xterm) this.createTerminalInstance();
        xterm.focus();
      }
    },

    service() {
      if (!this.running(this.project.id) && xterm) {
        xterm.write(`\r\u001b[1m${this.promptString}\u001b[22m${this.command}`);
        xterm.eraseRight();
        xterm.focus();
      }
    },

    logOutput(newLog, oldLog) {
      if (!xterm) return;
      if (newLog.indexOf(oldLog) === -1 || newLog.length < oldLog.length) {
        xterm.reset();
        xterm.write(newLog);
        return;
      }

      // Assume newLog has appended value from oldLog, so simply
      // grab the length and substr it
      const newValue = newLog.substr(oldLog.length);

      xterm.write(newValue);
    },
    isRunning(value) {
      if (!value) this.prompt();
    }
  }
};
</script>

<style lang="scss" scoped>
.commands {
  background: #0a0a0a;
  height: 100%;
  padding: 1rem;
  width: 100%;

  &__terminal {
    height: 100%;
    width: 100%;
  }
}
</style>
