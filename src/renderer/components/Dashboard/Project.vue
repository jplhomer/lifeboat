<template>
  <div>
    <header>
      <div class="level is-mobile">
        <div class="level-left">
          <div class="title is-4">
            {{ name }}
            <span class="tag" v-show="!running && !starting">Stopped</span>
            <span class="tag is-primary" v-show="running">Running</span>
            <span class="tag is-warning" v-show="starting">Starting</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="field is-grouped">
              <p class="control">
                <button @click.prevent="start" :class="`button is-info ${starting ? 'is-loading' : ''}`" :disabled="running">
                  <span class="icon">
                    <i class="fa fa-play-circle"></i>
                  </span>
                  <span>Start</span>
                </button>
              </p>
              <p class="control">
                <button @click.prevent="stop" class="button is-danger" :disabled="!running">
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

    <div class="tab-area">
      <div class="content" v-html="readme"></div>
    </div>

  </div>
</template>

<script>
import DockerConfig from "@/utils/docker-config";
import Service from "@/components/Dashboard/Service";
import markdown from "markdown";
import fs from "fs";

let config;

export default {
  props: ["name", "dir", "containers"],
  components: { Service },
  methods: {
    containerForService(service) {
      return this.projectContainers.find(c => c.serviceName === service);
    },
    start() {
      this.$docker.startProject(this.dir).catch(e => console.error(e));
    },
    stop() {
      this.$docker.stopProject(this.dir).catch(e => console.error(e));
    }
  },
  computed: {
    services() {
      return config.serviceNames();
    },
    projectContainers() {
      return this.containers
        .filter(c => c.project === this.name)
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
    },
    readme() {
      return markdown.markdown.toHTML(
        fs.readFileSync(`${this.dir}/README.md`, "utf8")
      );
    }
  },
  created() {
    config = new DockerConfig({ dir: this.dir, name: this.name });
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
