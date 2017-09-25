<template>
  <div class="docker-container">
    Status: {{ container.state }} {{ container.name }}
    <small>{{ container.image }}</small>
  </div>
</template>

<script>
export default {
  props: ["container"]
};
</script>

<style>
.docker-container {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, .25);
  padding: .5em;
}
</style>
