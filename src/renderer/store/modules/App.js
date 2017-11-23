import router from "@/router";
import Docker from "@/utils/docker";
import Container from "@/utils/docker-container";

const state = {
  containers: [],
  updateAvailable: false,
  loaded: false
};

const mutations = {
  UPDATE_CONTAINERS(state, containers) {
    state.containers = containers;
  },
  MARK_UPDATE_AVAILABLE(state, value) {
    state.updateAvailable = value;
  },
  MARK_LOADED(state) {
    state.loaded = true;
  }
};

const actions = {
  async boot({ dispatch, commit }) {
    await dispatch("loadProjects");
    dispatch("listenForContainerUpdates");

    commit("MARK_LOADED");
  },

  fetchContainers({ commit }) {
    Docker.listContainers().then(containers => {
      commit("UPDATE_CONTAINERS", containers.map(c => new Container(c)));
    });
  },

  // Listen to any status updates from Docker
  listenForContainerUpdates({ dispatch, commit }) {
    Docker.listen(data => {
      dispatch("fetchContainers");
    });
  }
};

const getters = {
  containers(state) {
    return state.containers;
  },
  loaded(state) {
    return state.loaded;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
