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
          <input class="command-text input" type="text" :placeholder="`Type a command to run in ${service}...`">
        </div>
        <div class="control">
          <button class="button">Run</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      service: 0
    };
  },
  computed: {
    services() {
      return this.activeProject.config.serviceNames();
    },
    ...mapGetters(["activeProject"])
  },
  created() {
    this.service = this.services[0];
  }
};
</script>


<style scoped>
.input,
.button,
.field {
  border-radius: 0 !important;
}

.commands {
  background: #050505;
  color: #fff;
  height: 100%;
}

.command-text {
  font-family: monospace;
}
</style>
