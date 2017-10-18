<template>
  <div>
    <header>
      <div class="level is-mobile">
        <div class="level-left">
          <div class="title is-4">
            {{ project.dirName }}
            <span class="tag" v-show="!running && !starting">Stopped</span>
            <span class="tag is-success" v-show="running && !missingComposeFile">Running</span>
            <span class="tag is-warning" v-show="starting">Starting</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="field is-grouped">
              <p class="control">
                <button @click.prevent="start" :class="`button is-info ${starting ? 'is-loading' : ''}`" v-show="!running">
                  <span class="icon">
                    <i class="fa fa-play-circle"></i>
                  </span>
                  <span>Start</span>
                </button>
              </p>
              <p class="control">
                <button @click.prevent="stop" :class="`button is-danger  ${stopping ? 'is-loading' : ''}`" v-show="partiallyRunning">
                  <span class="icon">
                    <i class="fa fa-stop-circle"></i>
                  </span>
                  <span>Stop</span>
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="services" v-show="!missingComposeFile">
      <div class="columns is-mobile is-multiline">
        <div v-for="service in project.services()" :key="service" class="column is-one-third">
          <project-service :service="service" :container="containerForService(service)"></project-service>
        </div>
      </div>
    </div>

    <div class="tabs" v-show="!missingComposeFile">
      <ul>
        <li :class="`${activeTab === 'logs' ? 'is-active' : ''}`">
          <a href="#" @click.prevent="setActiveTab('logs')">Logs</a>
        </li>
        <li :class="`${activeTab === 'about' ? 'is-active' : ''}`">
          <a href="#" @click.prevent="setActiveTab('about')">About</a>
        </li>
        <li :class="`${activeTab === 'commands' ? 'is-active' : ''}`">
          <a href="#" @click.prevent="setActiveTab('commands')">Commands</a>
        </li>
      </ul>
    </div>

    <div class="tab-area" ref="tabArea" v-show="!missingComposeFile">
      <project-log :project="project" v-show="activeTab === 'logs'"></project-log>
      <project-readme :project="project" v-show="activeTab === 'about'"></project-readme>
      <project-commands :project="project" v-show="activeTab === 'commands'"></project-commands>
    </div>

    <div class="notification is-danger" v-show="missingComposeFile">
      We couldn't find a
      <code>docker-compose.yml</code> file in {{ project.dir }}. Please add one and restart Lifeboat.
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProjectService from "@/components/Dashboard/ProjectService";
import ProjectLog from "@/components/Dashboard/ProjectLog";
import ProjectReadme from "@/components/Dashboard/ProjectReadme";
import ProjectCommands from "@/components/Dashboard/ProjectCommands";
import Vue from "vue";
import events from "@/utils/events";

const status = {
  STOPPING: "stopping",
  STOPPED: "stopped",
  STARTING: "starting",
  RUNNING: "running"
};

export default {
  props: ["project"],
  components: { ProjectService, ProjectLog, ProjectReadme, ProjectCommands },
  data() {
    return {
      activeTab: "logs",
      projectStatus: status.STOPPED
    };
  },
  methods: {
    containerForService(service) {
      return this.project.containers().find(c => c.service === service);
    },
    start() {
      this.projectStatus = status.STARTING;
      events.$emit("PROJECT_STARTED");
      this.$docker
        .startProject(this.project.dir)
        .then(() => (this.projectStatus = status.STARTED))
        .catch(e => console.error(e));
    },
    stop() {
      this.projectStatus = status.STOPPING;
      this.$docker
        .stopProject(this.project.dir)
        .then(() => (this.projectStatus = status.STOPPED))
        .catch(e => {
          // TODO: Fetch status?
          console.error(e);
        });
    },
    setActiveTab(tab) {
      this.setTabAreaHeight();
      this.activeTab = tab;
    },
    setTabAreaHeight() {
      const height =
        window.innerHeight - this.$refs.tabArea.getBoundingClientRect().top;
      this.$refs.tabArea.style.height = `${height}px`;
    }
  },
  computed: {
    starting() {
      return this.projectStatus === status.STARTING;
    },
    running() {
      return this.project.running();
    },
    partiallyRunning() {
      return this.project.containers().some(c => c.state === "running");
    },
    stopping() {
      return this.projectStatus === status.STOPPING;
    },
    missingComposeFile() {
      return !this.project.config.data;
    },
    ...mapGetters(["containers"])
  },
  mounted() {
    this.setTabAreaHeight();
    window.addEventListener("resize", this.setTabAreaHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setTabAreaHeight);
  }
};
</script>

<style lang="scss">
header {
  padding: 1em;
}

.services {
  background-color: #efefef;
  padding: 1rem;

  .column {
    padding: .35rem;
  }
}

.tabs {
  margin-bottom: 0 !important;
}

.tab-area {
  position: relative;
}
</style>
