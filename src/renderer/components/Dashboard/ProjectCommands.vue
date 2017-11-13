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
          <input v-model="command" class="command-text input" type="text" @keyup.enter="run(project.id)" @keydown.up="loadPreviousCommand" @keydown.down="loadNextCommand" :placeholder="`Type a command to run in ${service}...`">
        </div>
        <div class="control">
          <button @click.prevent="run(project.id)" class="button">Run</button>
        </div>
        <div class="control">
          <button @click.prevent="cancel(project.id)" class="button is-danger" v-show="running(project.id)">Cancel</button>
        </div>
      </div>
    </div>
    <pre class="commands__log" v-html="logOutput"></pre>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import AU from "ansi_up";
import scrollToBottom from "@/mixins/scroll-to-bottom";
const ansi_up = new AU();

export default {
  props: ["project"],
  mixins: [scrollToBottom],
  data() {
    return {
      cmd: null,
      commandHistory: [],
      commandPointer: 0
    };
  },
  methods: {
    addLog(data) {
      this.log += data;
      this.scrollToBottom();
    },
    loadPreviousCommand() {
      if (this.commandPointer) {
        this.command = this.commandHistory[--this.commandPointer];
      }
    },
    loadNextCommand() {
      if (this.commandPointer < this.commandHistory.length) {
        this.command = this.commandHistory[++this.commandPointer];
      }
    },

    ...mapActions("ProjectCommand", ["run", "cancel"])
  },
  computed: {
    services() {
      return this.project.services;
    },

    logOutput() {
      return ansi_up.ansi_to_html(this.logs(this.project.id));
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

    ...mapGetters("ProjectCommand", ["logs", "running"])
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
  background: var(--black-gradient);
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
