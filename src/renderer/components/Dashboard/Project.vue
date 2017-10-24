<template>
  <div>
    <header>
      <div class="level is-mobile status-bar">
        <div class="level-left">
          <div class="title is-4">
            {{ project.dirName }}
            <span :class="{ 'tag': true, 'is-success': running, 'is-warning': starting }">{{ statusText }}</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="field is-grouped">
              <p class="control" v-if="!running && !restarting">
                <button @click.prevent="start" :class="{ button: true, 'is-info': true, 'is-loading': starting }">
                  <span class="icon">
                    <i class="fa fa-play-circle"></i>
                  </span>
                  <span>Start</span>
                </button>
              </p>
              <p class="control" v-if="partiallyRunning && !starting && !stopping">
                <button @click.prevent="restart" :class="{ button: true,  'is-loading': restarting}" title="Restart">
                  <span class="icon">
                  <i class="fa fa-refresh"></i>
                  </span>
                </button>
              </p>
              <p class="control" v-if="partiallyRunning">
                <button @click.prevent="stop" :class="{ button: true, 'is-danger': true, 'is-loading': stopping}">
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
        <li :class="`${activeTab === 'options' ? 'is-active' : ''}`">
          <a href="#" @click.prevent="setActiveTab('options')">Options</a>
        </li>
      </ul>
    </div>

    <div class="tab-area" ref="tabArea" v-show="!missingComposeFile">
      <project-log :project="project" v-show="activeTab === 'logs'"></project-log>
      <project-readme :project="project" v-show="activeTab === 'about'"></project-readme>
      <project-commands :project="project" v-show="activeTab === 'commands'"></project-commands>
      <project-options :project="project" v-show="activeTab === 'options'"></project-options>
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
import ProjectOptions from "@/components/Dashboard/ProjectOptions";
import Vue from "vue";
import events from "@/utils/events";

const status = {
  STOPPING: "stopping",
  STOPPED: "stopped",
  STARTING: "starting",
  RUNNING: "running",
  RESTARTING: "restarting"
};

export default {
  props: ["project"],
  components: {
    ProjectService,
    ProjectLog,
    ProjectReadme,
    ProjectCommands,
    ProjectOptions
  },
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
        .startProject(this.project.dir, this.project.activeVariables)
        .then(() => (this.projectStatus = status.RUNNING))
        .catch(e => console.error(e));
    },
    stop() {
      this.projectStatus = status.STOPPING;
      this.$docker
        .stopProject(this.project.dir)
        .then(() => (this.projectStatus = status.STOPPED))
        .catch(e => console.error(e));
    },
    restart() {
      this.projectStatus = status.RESTARTING;
      this.$docker
        .restartProject(this.project.dir)
        .then(() => {
          this.projectStatus = status.RUNNING;
          this.$store.dispatch("fetchContainers");
        })
        .catch(e => console.error(e));
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
      return this.project.running() && !this.missingComposeFile;
    },
    partiallyRunning() {
      return this.project.containers().some(c => c.state === "running");
    },
    stopping() {
      return this.projectStatus === status.STOPPING;
    },
    restarting() {
      return this.projectStatus === status.RESTARTING;
    },
    missingComposeFile() {
      return !this.project.config.data;
    },
    statusText() {
      if (this.starting) {
        return "Starting";
      }

      if (this.running) {
        return "Running";
      }

      return "Stopped";
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

.status-bar {
  .level-item:last-child {
    margin-right: 0;
  }
}

.services {
  background-color: #efefef;
  padding: 1rem;

  .column {
    padding: 0.35rem;
  }
}

.tabs {
  margin-bottom: 0 !important;
}

.tab-area {
  position: relative;
}
</style>
