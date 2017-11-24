<template>
  <div class="service" @click="selectCommandService">
    <div class="service__name">
      <span class="icon has-text-primary" v-show="running">
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
    <div class="service__actions">
      <span :class="{
        'toggle-logs': true,
        button: true,
        'is-text': true,
        icon: true,
        'has-text-primary': activeFilters.includes(service)
      }" @click="toggleLogFilter" :title="`Filter logs by ${service}`">
        <i class="fa fa-file-text-o"></i>
      </span>
      <div class="tags">
        <span @click="openLocalhost(port)" v-for="port in ports" :key="port" class="tag is-small" :title="`${service} is exposed on port ${port}`">{{ port }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["project", "container", "service"],
  methods: {
    openLocalhost(port) {
      this.$electron.shell.openExternal(`http://localhost:${port}`);
    },

    selectCommandService() {
      if (this.projectActiveTab(this.project.id) !== "commands") {
        return;
      }

      this.$store.dispatch("ProjectCommand/setService", {
        id: this.project.id,
        service: this.service
      });
    },

    toggleLogFilter() {
      this.$store.dispatch("toggleProjectLogFilter", {
        id: this.project.id,
        service: this.service
      });
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
    },

    activeFilters() {
      return this.projectLogFilters(this.project.id);
    },

    ...mapGetters(["projectLogFilters", "projectActiveTab"])
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
  padding: 0.4em;
  justify-content: space-between;
  align-items: center;

  .toggle-logs {
    display: none;
  }

  &:hover .toggle-logs,
  .toggle-logs.has-text-primary {
    display: flex;
  }

  .tags {
    padding-left: 2px;
  }

  .tags:last-child {
    margin-bottom: 0;
  }

  .tag:not(:last-child) {
    margin-right: 2px;
  }

  .tag {
    cursor: pointer;
    font-size: 0.65rem;
    margin-bottom: 0;
  }

  &__actions {
    display: flex;
    align-items: center;

    button {
      text-decoration: none;
    }
  }

  .tab-commands & {
    cursor: pointer;

    &:not(.active) {
      background-color: #ccc;
    }

    .service__actions {
      display: none;
    }
  }
}

.service-stopped {
  color: #efefef;
}
</style>
