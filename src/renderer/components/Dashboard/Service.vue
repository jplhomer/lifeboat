<template>
  <div class="service">
    {{ service }}
  </div>
</template>

<script>
export default {
  props: ["service"]
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
