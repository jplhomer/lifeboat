<template>
  <grid disable-sidebar="true">
    <div class="settings">
      <div class="level is-mobile">
        <div class="level-left">
          <h1 class="title">Settings</h1>
        </div>
        <div class="level-right">
          <router-link to="/0" v-show="projects.length">Back</router-link>
        </div>
      </div>

      <settings-update></settings-update>

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
              {{ $store.getters.projectDirName(project.id) }}
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

      <div class="notification has-text-centered" v-show="!projects.length">
        Let's get started by adding your first project to Lifeboat!
      </div>

      <div class="holder" ref="dropzone">
        <p>Drag folder(s) here to add a project</p>
        <div class="file">
          <label class="file-label">
            <input class="file-input" type="file" name="dir" ref="file" webkitdirectory directory>
            <span class="file-cta">
              <span class="file-icon">
                <i class="fa fa-upload"></i>
              </span>
              <span class="file-label">
                Or select a folder
              </span>
            </span>
          </label>
        </div>
      </div>

      <div class="notification first-time-message has-text-centered is-success" v-show="showFirstTimeMessage">
        Great work!
        <b>
          <router-link to="/dashboard">Visit the dashboard</router-link>
        </b> to interact with your project!
      </div>
    </div>
  </grid>
</template>

<script>
import fs from "fs";
import Grid from "@/components/Grid";
import SettingsUpdate from "@/components/Settings/SettingsUpdate";
import { mapState, mapGetters } from "vuex";

export default {
  components: { Grid, SettingsUpdate },
  data() {
    return {
      showFirstTimeMessage: false
    };
  },
  methods: {
    addProject(path) {
      if (!fs.statSync(path).isDirectory()) {
        console.error(`${path} is not a directory!`);
        return;
      }

      if (!this.settings.hasAddedFirstProject) {
        this.$store.commit("UPDATE_SETTING", {
          key: "hasAddedFirstProject",
          value: true
        });
        this.showFirstTimeMessage = true;
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

    this.$refs.file.addEventListener("change", e => {
      for (let f of e.currentTarget.files) {
        this.addProject(f.path);
      }
    });
  },
  beforeDestroy() {
    this.showFirstTimeMessage = false;
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

.file {
  justify-content: center;
  margin-top: 1rem;
}

.first-time-message {
  margin-top: 1rem;
}
</style>


