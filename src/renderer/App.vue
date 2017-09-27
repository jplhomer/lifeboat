<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import settings from "./utils/settings";

export default {
  created() {
    this.$store.commit("LOAD_INITIAL_PROJECTS", settings.load().projects || []);
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Libre+Franklin:300,400,400i,700,700i');

body {
  font-family: 'Libre Franklin', sans-serif;
}
</style>
