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
        <div v-for="container in containers" :key="container.id" class="column is-one-third">
          <container :container="container"></container>
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
import Container from "@/components/Dashboard/Container";

export default {
  props: ["name", "dir", "containers"],
  components: { Container },
  methods: {
    start() {
      this.$docker.startProject(this.dir).catch(e => console.error(e));
    },
    stop() {
      this.$docker.stopProject(this.dir).catch(e => console.error(e));
    }
  },
  computed: {
    running() {
      const config = new DockerConfig({ dir: this.dir, name: this.name });
      const validServiceNames = this.containers
        .filter(c => c.project === this.name)
        .map(c => c.serviceName)
        .sort();

      /* prettier-ignore */
      return config.serviceNames().sort().join(',') === validServiceNames.join(',');
    }
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
