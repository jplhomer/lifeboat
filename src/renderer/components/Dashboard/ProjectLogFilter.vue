<template>
  <div class="filter-bar">
    <div>
      Showing logs for:
      <b>{{ activeFilterList }}</b>
    </div>
    <button @click="clear">Clear Filters</button>
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

    activeFilterList() {
      return this.activeFilters.join(", ");
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
  padding: 0.2rem 0.5rem;
  font-size: 0.8em;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

