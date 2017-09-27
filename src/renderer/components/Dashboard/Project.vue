<template>
  <div>
    <header>
      <div class="level is-mobile">
        <div class="level-left">
          <div class="title is-4">
            {{ project.name }}
            <span class="tag" v-show="!running && !starting">Stopped</span>
            <span class="tag is-primary" v-show="running">Running</span>
            <span class="tag is-warning" v-show="starting">Starting</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="field is-grouped">
              <p class="control">
                <button @click.prevent="start" :class="`button is-info ${starting ? 'is-loading' : ''}`" v-show="!running">
                  <span class="icon">
                    <i class="fa fa-play-circle"></i>
                  </span>
                  <span>Start</span>
                </button>
              </p>
              <p class="control">
                <button @click.prevent="stop" class="button is-danger" v-show="running">
                  <span class="icon">
                    <i class="fa fa-stop-circle"></i>
                  </span>
                  <span>Stop</span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="services">
      <div class="columns is-mobile is-multiline">
        <div v-for="service in services" :key="service" class="column is-one-third">
          <service :service="service" :container="containerForService(service)"></service>
        </div>
      </div>
    </div>

    <div class="tabs">
      <ul>
        <li class="is-active">
          <a>About</a>
        </li>
        <li>
          <a>Commands</a>
        </li>
        <li>
          <a>Settings</a>
        </li>
      </ul>
    </div>

    <readme></readme>

  </div>
</template>

<script>
import DockerConfig from "@/utils/docker-config";
import Service from "@/components/Dashboard/Service";
import Readme from "@/components/Dashboard/Readme";

let config;

export default {
  props: ["project", "containers"],
  components: { Service, Readme },
  methods: {
    containerForService(service) {
      return this.projectContainers.find(c => c.serviceName === service);
    },
    start() {
      this.$docker.startProject(this.project.dir).catch(e => console.error(e));
    },
    stop() {
      this.$docker.stopProject(this.project.dir).catch(e => console.error(e));
    }
  },
  computed: {
    services() {
      return config.serviceNames();
    },
    projectContainers() {
      return this.containers
        .filter(c => c.project === this.project.name)
        .filter(c => config.serviceNames().includes(c.serviceName));
    },
    starting() {
      return this.projectContainers.some(c => c.state === "created");
    },
    running() {
      const validServiceNames = this.projectContainers
        .filter(c => c.state === "running")
        .map(c => c.serviceName)
        .sort();

      return (
        config
          .serviceNames()
          .sort()
          .join(",") === validServiceNames.join(",")
      );
    }
  },
  created() {
    config = new DockerConfig(this.project);
  }
};
</script>

<style lang="scss">
header {
  padding: 1em;
}

.services {
  background-color: #efefef;
  padding: 1rem;

  .column {
    padding: .35rem;
  }
}

.tab-area {
  padding: 1rem;
  overflow-y: scroll;
}

.tabs {
  margin-bottom: 0 !important;
}
</style>
