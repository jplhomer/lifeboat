import * as types from "../mutation-types";

const state = {
  services: {},
  commands: {}
};

const mutations = {
  [types.UPDATE_PROJECT_COMMAND_COMMAND](state, { id, command }) {
    state.commands[id] = command;
  },

  [types.UPDATE_PROJECT_COMMAND_SERVICE](state, { id, service }) {
    state.services[id] = service;
  }
};

const getters = {
  command: state => id => {
    return state.commands[id] || "";
  },

  service: state => id => {
    return state.services[id] || 0;
  }
};

const actions = {
  setCommand({ commit }, { id, command }) {
    commit(types.UPDATE_PROJECT_COMMAND_COMMAND, { id, command });
  },

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
