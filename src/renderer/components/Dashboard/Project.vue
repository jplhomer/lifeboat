<template>
  <div>
    <header>
      <div class="level is-mobile">
        <div class="level-left">
          <div class="title is-4">{{ name }}</div>
        </div>
        <div class="level-right">
          <button @click.prevent="start" class="button is-primary is-small">
            Start
          </button>
          <button @click.prevent="stop" class="button is-small">
            Stop
          </button>
        </div>
      </div>
    </header>

    <div class="services">
      <div class="columns is-mobile is-multiline">
        <div v-for="service in services" :key="service" class="column is-one-third">
          <service :service="service"></service>
        </div>
      </div>
    </div>

    <p>
      Status: {{ running ? 'Running' : 'Stopped' }}
    </p>

    <p>

    </p>

    <p>
      README preview, if available
    </p>
    <p>Run a command</p>
  </div>
</template>

<script>
import DockerConfig from "@/utils/docker-config";
import Service from "@/components/Dashboard/Service";

let config;

export default {
  props: ["name", "dir", "containers"],
  components: { Service },
  methods: {
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
    running() {
      const validServiceNames = this.projectContainers
        .filter(c => c.project === this.name)
        .map(c => c.serviceName)
        .sort();

      /* prettier-ignore */
      return config.serviceNames().sort().join(',') === validServiceNames.join(',');
    }
  },
  created() {
    config = new DockerConfig({ dir: this.dir, name: this.name });
  }
};
</script>

<style>
header {
  padding: 1em;
}

.services {
  background-color: #efefef;
  padding: 1rem;
}
</style>
