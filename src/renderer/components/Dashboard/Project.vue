<template>
  <div>
    <header>
      <div class="level is-mobile status-bar">
        <div class="level-left">
          <div class="title is-4">
            {{ project.dirName }}
            <span :class="{ 'tag': true, 'is-primary': running, 'is-warning': starting }">{{ statusText }}</span>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="field has-addons">
              <div class="control" v-if="!running && !restarting">
                <div :class="{ dropdown: true, 'is-hoverable': !starting, 'is-right': true }">
                  <div class="dropdown-trigger">
                    <button @click.prevent="start" :class="{ button: true, 'is-primary': true, 'is-loading': starting }" aria-haspopup="true" aria-controls="start-button">
                      <span class="icon">
                        <i class="fa fa-play-circle"></i>
                      </span>
                      <span>Start</span>
                      <span class="icon is-small">
                        <i class="fa fa-angle-down" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="start-button" role="menu">
                    <div class="dropdown-content">
                      <a href="#" class="dropdown-item" @click.prevent="start">
                        <span class="icon">
                          <i class="fa fa-play-circle"></i>
                        </span>
                        Start
                      </a>
                      <a href="#" class="dropdown-item" @click.prevent="buildAndStart">
                        <span class="icon">
                          <i class="fa fa-archive"></i>
                        </span>
                        Build and Start
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <p class="control" v-if="partiallyRunning && !starting && !stopping">
                <button @click.prevent="restart" :class="{ button: true,  'is-loading': restarting}" title="Restart">
                  <span class="icon">
                  <i class="fa fa-refresh"></i>
                  </span>
                </button>
              </p>
              <p class="control" v-if="partiallyRunning">
                <button @click.prevent="stop" :class="{ button: true, 'is-loading': stopping}" title="Stop">
                  <span class="icon">
                    <i class="fa fa-stop-circle"></i>
                  </span>
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
      <project-log :project="project" :logs="logs" v-show="activeTab === 'logs'"></project-log>
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
  RUNNING: "running",
  RESTARTING: "restarting"
};

export default {
  props: ["project"],
  components: { ProjectService, ProjectLog, ProjectReadme, ProjectCommands },
  data() {
    return {
      activeTab: "logs",
      projectStatus: status.STOPPED,
      logs: "Click Start to see project logs",
      process: null
    };
  },
  methods: {
    containerForService(service) {
      return this.project.containers().find(c => c.service === service);
    },
    start() {
      this.logs = "";
      this.projectStatus = status.STARTING;

      this.startProcess(() => this.$docker.startProject(this.project.dir))
        .then(() => {
          this.projectStatus = status.RUNNING;
          this.startLogs();
        })
        .catch(() => (this.projectStatus = status.STOPPED));
    },
    buildAndStart() {
      this.logs = "";
      this.projectStatus = status.STARTING;

      this.startProcess(() => this.$docker.buildProject(this.project.dir))
        .then(() => this.start())
        .catch(() => (this.projectStatus = status.STOPPED));
    },
    stop() {
      this.projectStatus = status.STOPPING;
      this.startProcess(() => this.$docker.stopProject(this.project.dir))
        .then(() => (this.projectStatus = status.STOPPED))
        .catch(() => (this.projectStatus = status.STOPPED));
    },
    restart() {
      this.projectStatus = status.RESTARTING;
      this.startProcess(() => this.$docker.restartProject(this.project.dir))
        .then(() => {
          // For some reason, the logs persist from the previous running app?
          // So we don't need to call startLogs() again.
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
    },
    /**
     * Starts a child process passed as a closure, then prints the output of the
     * process, and resolves or rejects based on the exit code returned.
     */
    startProcess(method) {
      this.process = method.call();
      this.logProcess();
      return new Promise((resolve, reject) => {
        this.process.on("exit", signal => {
          if (signal === 1) {
            reject();
          } else {
            resolve();
          }
        });
      });
    },
    /**
     * Start getting logs for an already-running project
     */
    startLogs() {
      this.logs = "";
      this.process = this.$docker.logs(this.project.dir);
      this.logProcess();
    },
    /**
     * Log out a process's output. Docker Compose outputs a lot of stuff on stderr.
     */
    logProcess() {
      this.process.stdout.on("data", d => (this.logs += d.toString()));
      this.process.stderr.on("data", d => (this.logs += d.toString()));
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
    ...mapGetters(["containers", "activeProject"])
  },
  created() {
    // There is a delay on this for some reason.
    setTimeout(() => {
      if (this.running || this.partiallyRunning) {
        this.startLogs();
      }
    }, 500);
  },
  mounted() {
    this.setTabAreaHeight();
    window.addEventListener("resize", this.setTabAreaHeight);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setTabAreaHeight);
  },
  watch: {
    activeProject(newProjectId) {
      if (newProjectId == this.project.id) {
        this.setTabAreaHeight();
      }
    },
    running(value) {
      // Attempt to catch a project started outside of Lifeboat and watch the logs
      setTimeout(() => {
        if (value && !this.process) {
          console.log(
            `Starting logs for ${this.project.name} outside Lifeboat`
          );
          this.startLogs();
        }
      }, 1000);
    }
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
  background-color: var(--color-primary-white);
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
