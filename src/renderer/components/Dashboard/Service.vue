<template>
  <div class="service">
    <span class="icon has-text-success" v-show="running">
      <i class="fa fa-check-square"></i>
    </span>
    <span class="icon" v-show="starting">
      <i class="fa fa-refresh fa-spin"></i>
    </span>
    <span class="icon service-stopped" v-show="stopped">
      <i class="fa fa-check-square"></i>
    </span>
    {{ service }}
  </div>
</template>

<script>
export default {
  props: ["container", "service"],
  computed: {
    running() {
      return this.container && this.container.state === "running";
    },
    starting() {
      return this.container && this.container.state === "created";
    },
    stopped() {
      return !this.container || (!this.running && !this.starting);
    }
  }
};
</script>

<style>
.service {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 0 1px 0 rgba(0, 0, 0, .25);
  font-size: .9em;
  padding: .5em;
}

.service-stopped {
  color: #efefef;
}
</style>
