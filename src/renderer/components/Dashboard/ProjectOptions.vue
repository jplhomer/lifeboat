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
export default {
  props: ["project"],
  data() {
    return {
      variables: [
        {
          key: "FORCE_CACHING",
          value: 1,
          active: true
        },
        {
          key: "ANOTHER_THING",
          value: "0",
          active: false
        }
      ]
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
