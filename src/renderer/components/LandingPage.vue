<template>
  <grid>
    <aside class="menu" slot="sidebar">
      <p class="menu-label">Projects</p>
      <ul class="menu-list">
        <li><a href="#">intranet</a></li>
        <li><a href="#">intranet</a></li>
        <li><a href="#">intranet</a></li>
      </ul>
    </aside>

    <h1 class="title">intranet</h1>

    <p>
      Status: running, no
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
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
