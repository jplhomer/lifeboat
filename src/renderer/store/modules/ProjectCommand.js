import Vue from "vue";
import Vuex from "vuex";
import * as types from "../mutation-types";
import Docker from "@/utils/docker";

// Place to store command child processes run by projects
const processes = {};

const state = {
  commands: {},
  logs: {},
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

  [types.UPDATE_PROJECT_COMMAND_LOGS](state, { id, logs }) {
    Vue.set(state.logs, id, logs);
  },

  [types.RESET_PROJECT_COMMAND_STATE](state) {
    state.commands = {};
    state.logs = {};
    state.running = {};
    state.services = {};
  }
};

const getters = {
  command: state => id => {
    return state.commands[id] || "";
  },

  logs: state => id =>
    state.logs[id] || "Type any command to run inside the selected service",

  process: () => id => {
    return processes[id];
  },

  running: state => id => {
    return !!state.running[id];
  },

  service: state => id => {
    return state.services[id];
  }
};

const actions = {
  addLogs({ state, commit }, { id, logs }) {
    commit(types.UPDATE_PROJECT_COMMAND_LOGS, {
      id,
      logs: (state.logs[id] || "") + logs
    });
  },

  setCommand({ commit }, { id, command }) {
    commit(types.UPDATE_PROJECT_COMMAND_COMMAND, { id, command });
  },

  sendKey(context, { id, key }) {
    processes[id].write(key);
  },

  setService({ commit }, { id, service }) {
    commit(types.UPDATE_PROJECT_COMMAND_SERVICE, { id, service });
  },

  run({ commit, getters, state, dispatch, rootGetters }, id) {
    const project = rootGetters.projects[id];
    const service = getters.service(id);
    const command = getters.command(id);

    commit(types.UPDATE_PROJECT_COMMAND_RUNNING, { id, running: true });
    processes[id] = Docker.run(project.dir, service, command.split(" "));
    commit(types.UPDATE_PROJECT_COMMAND_COMMAND, { id, command: "" });

    processes[id].on("data", logs => dispatch("addLogs", { id, logs }));

    processes[id].on("exit", () =>
      commit(types.UPDATE_PROJECT_COMMAND_RUNNING, { id, running: false })
    );

    return processes[id];
  },

  resize({}, payload) {
    Object.keys(processes).forEach(key => {
      if (processes[key]) processes[key].resize(payload.cols, payload.rows);
    });
  },

  clearState({ commit }) {
    commit(types.RESET_PROJECT_COMMAND_STATE);

    // Kill any running commands
    Object.keys(processes).forEach(c => {
      if (processes[c]) processes[c].kill();
      delete processes[c];
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
