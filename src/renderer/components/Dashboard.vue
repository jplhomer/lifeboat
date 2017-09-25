<template>
  <grid>
    <aside class="menu" slot="sidebar">
      <p class="menu-label">Projects</p>
      <ul class="menu-list">
        <li><a class="is-active" href="#">zonemeals</a></li>
        <li><a href="#">intranet</a></li>
        <li><a href="#">intranet</a></li>
      </ul>
    </aside>

    <h1 class="title">{{ name }}</h1>

    <h2 class="title is-5">Containers</h2>
    <ul>
      <li v-for="container in containers">
        {{ container.Names[0] }}<br>
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
  </grid>
</template>

<script>
  import Grid from './Grid'
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
    components: { Grid, SystemInformation },
    data() {
      return {
        name: 'zonemeals',
        dir: '/Users/jplhomer/Documents/Apps/zonemeals',
        containers: []
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },

      fetchContainers() {
        this.$docker.listContainers().then((containers) => {
          this.containers = containers.filter(c => c.Names.some(name => name.indexOf(this.name) > -1));
        })
      },

      startProject(e) {
        e.preventDefault()
        console.log('starting project...')
        this.$docker.startProject(this.dir).then((res) => {
          this.fetchContainers();
        }).catch(e => console.error(e));
      }
    },
    created() {
      this.fetchContainers();

      setInterval(this.fetchContainers, 10000);
    },
    computed: {
      running() {
        return this.containers.length;
      }
    }
  }
</script>

<style>

</style>
