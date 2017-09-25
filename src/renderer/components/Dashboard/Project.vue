<template>
  <div>
    <h1 class="title">{{ name }}</h1>

    <h2 class="title is-5">Containers</h2>
    <ul>
      <li v-for="container in containers">
        {{ container.name }}<br>
        <small>{{ container.image }}</small>
      </li>
    </ul>

    <p>
      Status: {{ running ? 'Running' : 'Stopped' }}
    </p>

    <p>
      <button @click.prevent="start" class="button is-primary">Start</button>
      <button @click.prevent="stop" class="button">Stop</button>
    </p>
    <p>
      Services + statuses
    </p>
    <p>
      README preview, if available
    </p>
    <p>Run a command</p>
  </div>
</template>

<script>
import DockerConfig from "@/utils/docker-config";

export default {
  props: ["name", "dir", "containers"],
  methods: {
    start() {
      this.$docker
        .startProject(this.dir)
        .then(res => {
        })
        .catch(e => console.error(e));
    },
    stop() {
      this.$docker
        .stopProject(this.dir)
        .then(res => {
        })
        .catch(e => console.error(e));
    }
  },
  computed: {
    running() {
      const config = new DockerConfig({ dir: this.dir, name: this.name });
      return config
        .serviceNames()
        .every(name => this.containers.some(c => c.name.indexOf(name) > -1));
    }
  }
};
</script>
