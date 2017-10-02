import router from "@/router";
import docker from "@/utils/docker";
import Container from "@/utils/docker-container";

const state = {
  activeProject: 0,
  containers: []
};

const mutations = {
  UPDATE_ACTIVE_PROJECT(state, projectId) {
    state.activeProject = projectId;
  },
  UPDATE_CONTAINERS(state, containers) {
    state.containers = containers;
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
