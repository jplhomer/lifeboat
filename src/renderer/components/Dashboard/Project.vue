<template>
  <div>
    <header>
      <div class="level is-mobile">
        <div class="level-left">
          <div class="title is-4">
            {{ project.dirName }}
            <span class="tag" v-show="!running && !starting">Stopped</span>
            <span class="tag is-success" v-show="running">Running</span>
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
                <button @click.prevent="stop" class="button is-danger" v-show="partiallyRunning">
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

    <div class="services">
      <div class="columns is-mobile is-multiline">
        <div v-for="service in project.services()" :key="service" class="column is-one-third">
          <project-service :service="service" :container="containerForService(service)"></project-service>
        </div>
      </div>
    </div>

    <div class="tabs">
      <ul>
        <router-link tag="li" :to="`/${project.id}/log`">
          <a href="#">Logs</a>
        </router-link>
        <router-link tag="li" :to="`/${project.id}/about`">
          <a href="#">About</a>
        </router-link>
        <router-link tag="li" :to="`/${project.id}/command`">
          <a href="#">Commands</a>
        </router-link>
      </ul>
    </div>

    <!-- <readme></readme> -->
    <div class="tab-area" ref="tabArea">
      <router-view></router-view>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProjectService from "@/components/Dashboard/ProjectService";
import Vue from "vue";
import events from "@/utils/events";

export default {
  props: ["project"],
  components: { ProjectService },
  methods: {
    containerForService(service) {
      return this.project.containers().find(c => c.service === service);
    },
    start() {
      this.$docker.startProject(this.project.dir).catch(e => console.error(e));
      events.$emit("PROJECT_STARTED");
    },
    stop() {
      this.$docker.stopProject(this.project.dir).catch(e => console.error(e));
    },
    setTabAreaHeight() {
      const height =
        window.innerHeight - this.$refs.tabArea.getBoundingClientRect().top;
      this.$refs.tabArea.style.height = `${height}px`;
    }
  },
  computed: {
    starting() {
      return this.project.containers().some(c => c.state === "created");
    },
    running() {
      return this.project.running();
    },
    partiallyRunning() {
      return this.project.containers().some(c => c.state === "running");
    },
    ...mapGetters(["containers"])
  },
  watch: {
    $route(to, from) {
      Vue.nextTick(() => this.setTabAreaHeight());
    }
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
