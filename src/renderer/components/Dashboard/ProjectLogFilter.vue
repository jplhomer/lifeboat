<template>
  <div class="filter-bar">
    <span class="icon">
      <i class="fa fa-filter fa-lg"></i>
    </span>
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
  padding: 0.3rem;
  font-size: 0.8em;
  display: flex;
  overflow-y: scroll;
}

.filter-bar span {
  margin-right: 0.5em;
}

button {
  -webkit-appearance: none;
  cursor: pointer;
  border: 0;
  padding: 0 10px 2px;
  background-color: #ddd;
  border-radius: 10px;
  margin-right: 5px;
}

button:hover {
  background-color: #ccc;
}

button.active {
  background-color: var(--color-primary);
  color: #fff;
}

button.active:hover {
  background-color: var(--color-primary);
}

button:focus {
  outline: 0;
}
</style>

