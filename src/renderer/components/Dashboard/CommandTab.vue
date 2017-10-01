<template>
  <div class="commands">
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
    <pre class="commands__log" v-html="log"></pre>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      service: 0,
      command: "",
      log: "",
      cmd: null
    };
  },
  methods: {
    run() {
      this.log = `docker run --rm ${this.service} ${this.command}\r\n`;

      this.cmd = this.$docker.run(
        this.activeProject.dir,
        this.service,
        this.command.split(" ")
      );

      this.command = "";

      this.cmd.stdout.on("data", data => {
        this.log += data.toString();
      });

      // TODO: Doesn't work
      this.cmd.stdout.on("exit", data => {
        this.cmd = null;
      });
    },
    cancel() {
      this.cmd.exit();
    }
  },
  computed: {
    services() {
      return this.activeProject.config.serviceNames();
    },
    // NOT ACCURATE
    running() {
      return !!this.cmd;
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
  padding-top: 2rem;

  &__bar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
  }

  &__log {
    background-color: inherit;
    color: inherit;
    font-family: monospace;
    padding: 1rem;
  }
}

.command-text {
  font-family: monospace;
}
</style>
