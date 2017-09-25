<template>
  <div>
    <h1 class="title">{{ name }}</h1>

    <h2 class="title is-5">Containers</h2>
    <ul>
      <li v-for="container in containers">
        {{ container.name }}<br>
        <small>{{ container.Image }}</small>
      </li>
    </ul>

    <p>
      Status: {{ running ? 'Running' : 'Stopped' }}
    </p>

    <p>
      <button @click="startProject" class="button is-primary">Start</button>
      <button class="button">Stop</button>
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
import DockerConfig from '@/utils/docker-config';

export default {
  props: ['name', 'dir', 'containers'],
  methods: {
    startProject(e) {
      e.preventDefault()
      console.log('starting project...')
      this.$docker.startProject(this.dir).then((res) => {
        // TODO: Reload containers?
      }).catch(e => console.error(e));
    }
  },
  computed: {
    running() {
      const config = new DockerConfig({ dir: this.dir, name: this.name });
      return config.serviceNames().every(name => this.containers.includes(c => c.name.indexOf(name) > -1));
    }
  }
}
</script>
