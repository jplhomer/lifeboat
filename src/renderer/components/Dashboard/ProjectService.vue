<template>
  <div class="service">
    <div class="service__name">
      <span class="icon has-text-success" v-show="running">
        <i class="fa fa-check-square"></i>
      </span>
      <span class="icon" v-show="starting">
        <i class="fa fa-refresh fa-spin"></i>
      </span>
      <span class="icon service-stopped" v-show="stopped">
        <i class="fa fa-check-square"></i>
      </span>

      {{ service }}
    </div>

    <div class="service__tags tags">
      <span @click="openLocalhost(port)" v-for="port in ports" :key="port" class="tag is-small" :title="`${service} is exposed on port ${port}`">{{ port }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["container", "service"],
  methods: {
    openLocalhost(port) {
      this.$electron.shell.openExternal(`http://localhost:${port}`);
    }
  },
  computed: {
    running() {
      return this.container && this.container.state === "running";
    },
    starting() {
      return this.container && this.container.state === "created";
    },
    stopped() {
      return !this.container || (!this.running && !this.starting);
    },
    ports() {
      if (this.container) {
        return this.container.ports;
      }

      return [];
    }
  }
};
</script>

<style scoped lang="scss">
.service {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.25);
  display: flex;
  font-size: 0.9em;
  padding: 0.5em;
  justify-content: space-between;

  .tag {
    cursor: pointer;
    font-size: 0.65rem;
  }
}

.service-stopped {
  color: #efefef;
}
</style>
