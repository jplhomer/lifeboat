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
          <input v-model="command" class="command-text input" type="text" @keyup.enter="run" :placeholder="`Type a command to run in ${service}...`">
        </div>
        <div class="control">
          <button @click.prevent="run" class="button">Run</button>
        </div>
        <div class="control">
          <button @click.prevent="cancel" class="button is-danger" v-show="running">Cancel</button>
        </div>
      </div>
    </div>
    <pre class="commands__log" v-html="logOutput"></pre>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import AU from "ansi_up";
import scrollToBottom from "@/mixins/scroll-to-bottom";
const ansi_up = new AU();

export default {
  mixins: [scrollToBottom],
  data() {
    return {
      service: 0,
      command: "",
      log: "",
      cmd: null
    };
  },
  methods: {
    addLog(data) {
      this.log += data;
      this.scrollToBottom();
    },
    run() {
      if (this.running) {
        this.runMounted();
        return;
      }

      this.log = `$ docker-compose run --rm ${this.service} ${this
        .command}\r\n`;

      this.cmd = this.$docker.run(
        this.activeProject.dir,
        this.service,
        this.command.split(" ")
      );

      this.command = "";

      this.cmd.stdout.on("data", data => {
        this.addLog(data.toString());
      });

      this.cmd.stderr.on("data", data => {
        this.addLog(data.toString());
      });

      this.cmd.on("exit", data => {
        this.cmd = null;
      });
    },
    runMounted() {
      if (this.command === "clear") {
        this.log = this.command = "";
        return;
      }

      this.addLog(`$ ${this.command}\r\n`);
      this.cmd.stdin.write(this.command + "\n");
      this.command = "";
    },
    cancel() {
      this.cmd.kill();
    }
  },
  computed: {
    services() {
      return this.activeProject.services();
    },
    running() {
      return !!this.cmd;
    },
    logOutput() {
      return ansi_up.ansi_to_html(this.log);
    },
    ...mapGetters(["activeProject"])
  },
  created() {
    this.service = this.services[0];
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
  background: #050505;
  color: #fff;
  height: 100%;
  overflow: scroll;
  padding-bottom: 2rem;

  &__bar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &__log {
    background-color: inherit;
    color: inherit;
    font-family: monospace;
    padding: 1rem;
    white-space: pre-wrap;
  }
}

.command-text {
  font-family: monospace;
}
</style>
