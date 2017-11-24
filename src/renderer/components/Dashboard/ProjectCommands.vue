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
    async attachToProcess() {
      process = this.process(this.project.id);
      process.on("data", d => xterm.write(d));
      process.on("exit", this.prompt);
    },

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
          xterm.fit();
        }, 200)
      );
    },

    handleTerminalInput() {
      xterm.on("key", this.handleKey);
      xterm.on("paste", d => {
        this.command += d;
        xterm.write(d);
      });
    },

    async handleKey(key, ev) {
      const printable =
        !ev.altKey &&
        !ev.altGraphKey &&
        !ev.ctrlKey &&
        !ev.metaKey &&
        !/arrow|tab/i.test(ev.key);

      if (this.running(this.project.id)) {
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
        await this.run(this.project.id);
        this.attachToProcess();

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
      xterm.write(`\r\n\u001b[1m${this.promptString}\u001b[22m`);
    },

    welcome() {
      if (this.running(this.project.id)) return;

      xterm.writeln("Type any command to run inside the selected service");
      this.prompt();
    },

    ...mapActions("ProjectCommand", [
      "run",
      "cancel",
      "loadPreviousCommand",
      "loadNextCommand",
      "getProcess"
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

    ...mapGetters("ProjectCommand", ["running", "process"]),
    ...mapGetters(["projectActiveTab"])
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
        xterm.focus();
      }
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
