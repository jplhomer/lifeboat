import Vue from "vue";
import Vuex from "vuex";
import * as types from "../mutation-types";
import Docker from "@/utils/docker";

// Place to store command child processes run by projects
const commands = {};

const state = {
  commands: {},
  running: {},
  services: {}
};

const mutations = {
  [types.UPDATE_PROJECT_COMMAND_COMMAND](state, { id, command }) {
    Vue.set(state.commands, id, command);
  },

  [types.UPDATE_PROJECT_COMMAND_SERVICE](state, { id, service }) {
    Vue.set(state.services, id, service);
  },

  [types.UPDATE_PROJECT_COMMAND_RUNNING](state, { id, running }) {
    Vue.set(state.running, id, running);
  },

  [types.RESET_PROJECT_COMMAND_STATE](state) {
    state.commands = {};
    state.running = {};
    state.services = {};
  }
};

const getters = {
  command: state => id => {
    return state.commands[id] || "";
  },

  process: () => id => {
    return commands[id];
  },

  running: state => id => {
    return !!state.running[id];
  },

  service: state => id => {
    return state.services[id];
  }
};

const actions = {
  setCommand({ commit }, { id, command }) {
    commit(types.UPDATE_PROJECT_COMMAND_COMMAND, { id, command });
  },

  sendKey(context, { id, key }) {
    commands[id].write(key);
  },

  setService({ commit }, { id, service }) {
    commit(types.UPDATE_PROJECT_COMMAND_SERVICE, { id, service });
  },

  run({ commit, getters, state, dispatch, rootGetters }, id) {
    const project = rootGetters.projects[id];
    const service = getters.service(id);
    const command = getters.command(id);

    commit(types.UPDATE_PROJECT_COMMAND_RUNNING, { id, running: true });
    commands[id] = Docker.run(project.dir, service, command.split(" "));
    commit(types.UPDATE_PROJECT_COMMAND_COMMAND, { id, command: "" });

    commands[id].on("exit", data => {
      commit(types.UPDATE_PROJECT_COMMAND_RUNNING, { id, running: false });
    });

    return commands[id];
  },

  clearState({ commit }) {
    commit(types.RESET_PROJECT_COMMAND_STATE);

    // Kill any running commands
    Object.keys(commands).forEach(c => {
      if (commands[c]) commands[c].kill();
      delete commands[c];
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
