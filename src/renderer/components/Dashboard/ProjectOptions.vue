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
            <input type="checkbox" v-model="variable.active">
          </td>
          <td>
            <input class="input is-small" type="text" v-model="variable.key">
          </td>
          <td>
            <input class="input is-small" type="text" v-model="variable.value">
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
import _ from "lodash";
let addingNew = false;

export default {
  props: ["project"],
  data() {
    return {
      variables: _.cloneDeep(this.project.variables)
    };
  },
  methods: {
    add() {
      this.variables.push({
        key: "",
        value: "",
        active: false
      });
    },
    remove(idx) {
      this.variables.splice(idx, 1);
    }
  },
  watch: {
    variables: {
      handler: _.debounce(function(val) {
        this.$store.commit("UPDATE_PROJECT_VARIABLES", {
          id: this.project.id,
          variables: val.filter(v => v.key && v.value)
        });
      }, 500),
      deep: true
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
