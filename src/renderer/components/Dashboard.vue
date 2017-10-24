<template>
  <grid>
    <aside class="sidebar__menu" slot="sidebar">
      <ul>
        <li v-for="project in projects" :key="project.id">
          <a href="#" @click.prevent="activeProject = project.id" :class="`${activeProject == project.id ? 'is-active' : ''}`">
            <span :class="`status status--${project.status()}`"></span>
            {{ project.dirName }}
          </a>
        </li>
      </ul>
    </aside>

    <div class="sidebar__actions" slot="sidebar">
      <router-link to="settings" class="icon is-medium" title="Settings">
        <span v-show="updateAvailable" class="badge"></span>
        <i class="fa fa-lg fa-cog"></i>
      </router-link>
    </div>

    <project v-for="project in projects" :key="project.id" :project="project" v-show="activeProject == project.id"></project>

  </grid>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import Grid from "./Grid";
import Project from "./Dashboard/Project";
import Container from "../utils/docker-container";
import Mousetrap from "mousetrap";

export default {
  name: "dashboard",
  components: { Grid, Project },
  methods: {
    previousProject() {
      const idx = this.activeProject;
      this.activeProject = idx === 0 ? this.projects.length - 1 : idx - 1;
    },
    nextProject() {
      const idx = this.activeProject;
      this.activeProject = idx === this.projects.length - 1 ? 0 : idx + 1;
    },
    ...mapActions(["fetchContainers", "listenForContainerUpdates"])
  },
  created() {
    this.fetchContainers();
    this.listenForContainerUpdates();
    this.activeProject = this.projects[0].id;
  },
  mounted() {
    Mousetrap.bind("meta+shift+[", this.previousProject);
    Mousetrap.bind("ctrl+shift+tab", this.previousProject);
    Mousetrap.bind("meta+shift+]", this.nextProject);
    Mousetrap.bind("ctrl+tab", this.previousProject);
  },
  computed: {
    activeProject: {
      get() {
        return this.$store.state.App.activeProject;
      },
      set(projectId) {
        this.$store.commit("SET_ACTIVE_PROJECT", projectId);
      }
    },
    ...mapGetters(["projects"]),
    ...mapState({
      updateAvailable: state => state.App.updateAvailable
    })
  }
};
</script>

<style lang="scss" scoped>
.status {
  --size: 0.5em;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: var(--size);
  display: inline-block;
  height: var(--size);
  margin-right: 0.2em;
  width: var(--size);

  &--running {
    background-color: #23d160;
  }

  &--partial {
    background-color: #ffdd57;
  }
}

.sidebar__actions a {
  position: relative;
}

.badge {
  --size: 0.5em;
  background-color: #ff3860;
  border-radius: var(--size);
  display: inline-block;
  position: absolute;
  right: 0.3em;
  top: 0.3em;
  height: var(--size);
  width: var(--size);
}
</style>
