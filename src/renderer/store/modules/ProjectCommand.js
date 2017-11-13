import * as types from "../mutation-types";

const state = {
  projectCommands: {}
};

const mutations = {
  [types.UPDATE_PROJECT_COMMAND_SERVICE](state, { id, service }) {
    state.projectCommands[id] = service;
  }
};

const getters = {
  service: state => id => {
    return state.projectCommands[id] || 0;
  }
};

const actions = {
  setService({ commit }, { id, service }) {
    commit(types.UPDATE_PROJECT_COMMAND_SERVICE, { id, service });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
