import router from "@/router";

const state = {
  activeProject: 0
};

const mutations = {
  UPDATE_ACTIVE_PROJECT(state, projectId) {
    state.activeProject = projectId;
  }
};

export default {
  state,
  mutations
};
