<template>
  <div class="project-options">
    <h2 class="title is-5">Options</h2>

    <p>Run <code>{{ project.name}}</code> with the following environmental variables:</p>

    <table class="table">
      <thead>
        <th></th>
        <th>Variable</th>
        <th colspan="2">Value</th>
      </thead>
      <tbody>
        <tr v-for="(variable, idx) in variables" :key="idx">
          <td>
            <input type="checkbox" :checked="variable.active" @change="update(idx, 'active', $event.target.value)">
          </td>
          <td>
            <input class="input is-small" type="text" :value="variable.key" @change="update(idx, 'key', $event.target.value)">
          </td>
          <td>
            <input class="input is-small" type="text" :value="variable.value" @change="update(idx, 'value', $event.target.value)">
          </td>
          <td valign="center">
            <button class="delete is-small" @click.prevent="remove(idx)"></button>
          </td>
        </tr>
      </tbody>
    </table>
    <button class="button is-small" @click.prevent="add">Add Variable</button>
  </div>
</template>

<script>
export default {
  props: ["project"],
  data() {
    return {
      variables: this.project.variables
    };
  },
  methods: {
    add() {
      this.$store.commit("NEW_PROJECT_VARIABLE", {
        id: this.project.id
      });
    },
    remove(idx) {
      this.$store.commit("REMOVE_PROJECT_VARIABLE", {
        id: this.project.id,
        idx
      });
    },
    update(idx, key, value) {
      this.$store.commit("UPDATE_PROJECT_VARIABLE", {
        id: this.project.id,
        idx,
        key,
        value
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.project-options {
  padding: 1rem;
  height: 100%;
  overflow: scroll;
}

.input {
  font-family: monospace;
}

.table {
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  width: 100%;
}
</style>
