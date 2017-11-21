<template>
  <div class="filter-bar">
    <span :class="{ icon: true, 'has-text-primary': activeFilters.length }" @click="clear" title="Clear filters">
      <i class="fa fa-filter fa-lg"></i>
    </span>
    <button v-for="service in project.services" :key="service"
      :class="{ active: activeFilters.includes(service) }"
      @click="toggle(service)"
      :title="`Show logs for ${service}`">{{ service }}</button>
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
    },

    clear() {
      this.$store.dispatch("clearProjectLogFilters", this.project.id);
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
  background: rgba(255, 255, 255, 0.9);
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  padding: 0.2rem;
  font-size: 0.8em;
  display: flex;
  align-items: center;
  overflow-y: scroll;
}

.filter-bar span {
  cursor: pointer;
  margin-right: 0.5em;
}

button {
  -webkit-appearance: none;
  cursor: pointer;
  border: 0;
  padding: 3px 10px 5px;
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

