<template>
  <div class="service">
    <span class="tag" v-show="!container || container.state != 'running'">Stopped</span>
    <span class="tag is-success" v-show="container && container.state === 'running'">Running</span>
    {{ service }}
  </div>
</template>

<script>
export default {
  props: ["container", "service"]
};
</script>

<style>
.service {
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, .25);
  padding: .5em;
}
</style>
