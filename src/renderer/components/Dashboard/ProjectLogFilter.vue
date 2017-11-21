<template>
  <div class="filter-bar">
    <span>Filter:</span>
    <button v-for="service in project.services" :key="service" :class="{ active: activeFilters.includes(service) }" @click="toggle(service)">{{ service }}</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: ["project"],

  methods: {
    toggle(service) {
      this.$store.dispatch("toggleProjectLogFilter", {
        id: this.project.id,
        service
      });
    }
  },

  computed: {
    activeFilters() {
      return this.projectLogFilters(this.project.id);
    },

    ...mapGetters(["projectLogFilters"])
  }
};
</script>

<style scoped>
.filter-bar {
  background: #efefef;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding: 0.5rem;
  font-size: 0.8em;
}
</style>

