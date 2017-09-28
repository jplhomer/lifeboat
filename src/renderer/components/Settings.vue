<template>
  <grid disable-sidebar="true">
    <div class="settings">
      <div class="level is-mobile">
        <div class="level-left">
          <h1 class="title">Settings</h1>
        </div>
        <div class="level-right">
          <router-link to="/0" v-show="settings.projects.length">Back</router-link>
        </div>
      </div>

      <table class="table" style="width: 100%">
        <thead>
          <tr>
            <th>Project Name</th>
            <th colspan="2">Path</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td>
              {{ project.name }}
            </td>
            <td>
              {{ project.dir }}
            </td>
            <td class="has-text-right">
              <button class="delete" @click="deleteProject(project)"></button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="notification" v-show="!settings.projects.length">
        Let's get started by adding your first project to Lifeboat!
      </div>

      <div class="holder" ref="dropzone">
        Drag folder(s) here to add a project
      </div>
    </div>
  </grid>
</template>

<script>
import fs from "fs";
import Grid from "@/components/Grid";
import { mapState, mapGetters } from "vuex";

export default {
  components: { Grid },
  data() {
    return {};
  },
  methods: {
    addProject(path) {
      if (!fs.statSync(path).isDirectory()) {
        console.error(`${path} is not a directory!`);
        return;
      }

      this.$store.commit("ADD_PROJECT", path);
    },
    deleteProject(project) {
      this.$store.commit("REMOVE_PROJECT", project.id);
    }
  },
  computed: {
    ...mapState({
      settings: state => state.Settings
    }),
    ...mapGetters(["projects"])
  },
  mounted() {
    this.$refs.dropzone.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove("over");

      for (let f of e.dataTransfer.files) {
        this.addProject(f.path);
      }
    });

    this.$refs.dropzone.addEventListener("dragover", function(e) {
      this.classList.add("over");
      e.preventDefault();
      e.stopPropagation();
    });

    this.$refs.dropzone.addEventListener("dragleave", function(e) {
      this.classList.remove("over");
      e.preventDefault();
      e.stopPropagation();
    });
  }
};
</script>

<style lang="scss">
.settings {
  padding: 1rem;
}

.holder {
  border: 1px dashed gray;
  padding: 3rem;
  text-align: center;

  &.over {
    background-color: #efefef;
  }
}
</style>


