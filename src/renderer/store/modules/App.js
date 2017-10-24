import router from "@/router";
import docker from "@/utils/docker";
import Container from "@/utils/docker-container";

const state = {
  containers: [],
  updateAvailable: false,
  activeProject: 0
};

const mutations = {
  SET_ACTIVE_PROJECT(state, projectId) {
    state.activeProject = projectId;
  },
  UPDATE_CONTAINERS(state, containers) {
    state.containers = containers;
  },
  MARK_UPDATE_AVAILABLE(state, value) {
    state.updateAvailable = value;
  }
};

const actions = {
  fetchContainers({ commit }) {
    docker.listContainers().then(containers => {
      commit("UPDATE_CONTAINERS", containers.map(c => new Container(c)));
    });
  },

  // Listen to any status updates from Docker
  listenForContainerUpdates({ dispatch, commit }) {
    docker.listen(data => {
      dispatch("fetchContainers");
    });
  }
};

const getters = {
  containers(state) {
    return state.containers;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
