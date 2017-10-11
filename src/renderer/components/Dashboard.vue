<template>
  <grid>
    <aside class="sidebar__menu" slot="sidebar">
      <ul>
        <li v-for="project in projects" :key="project.id">
          <a href="#" @click.prevent="activeProject = project" :class="`${activeProject == project ? 'is-active' : ''}`">
            <span :class="`status status--${project.status()}`"></span>
            {{ project.dirName }}
          </a>
        </li>
      </ul>
    </aside>

    <div class="sidebar__actions" slot="sidebar">
      <router-link to="settings" class="icon is-medium" title="Settings">
        <i class="fa fa-lg fa-cog"></i>
      </router-link>
    </div>

    <project v-for="project in projects" :key="project.id" :project="project" v-show="activeProject == project"></project>

  </grid>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Grid from "./Grid";
import Project from "./Dashboard/Project";
import Container from "../utils/docker-container";
import Mousetrap from "mousetrap";

export default {
  name: "landing-page",
  components: { Grid, Project },
  data() {
    return {
      activeProject: null
    };
  },
  methods: {
    previousProject() {
      const idx = this.projects.indexOf(this.activeProject);
      this.activeProject =
        idx === 0 ? this.projects.slice().pop() : this.projects[idx - 1];
    },
    nextProject() {
      const idx = this.projects.indexOf(this.activeProject);
      this.activeProject =
        idx === this.projects.length - 1
          ? this.projects[0]
          : this.projects[idx + 1];
    },
    ...mapActions(["fetchContainers", "listenForContainerUpdates"])
  },
  created() {
    this.fetchContainers();
    this.listenForContainerUpdates();
    this.activeProject = this.projects[0];
  },
  mounted() {
    Mousetrap.bind("meta+shift+[", this.previousProject);
    Mousetrap.bind("ctrl+shift+tab", this.previousProject);
    Mousetrap.bind("meta+shift+]", this.nextProject);
    Mousetrap.bind("ctrl+tab", this.previousProject);
  },
  computed: {
    ...mapGetters(["projects"])
  }
};
</script>

<style lang="scss">
.status {
  --size: .5em;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, .5);
  border-radius: var(--size);
  display: inline-block;
  height: var(--size);
  margin-right: .2em;
  width: var(--size);

  &--running {
    background-color: #23d160;
  }

  &--partial {
    background-color: #ffdd57;
  }
}
</style>
