import Vue from "vue";
import Vuex from "vuex";
import * as types from "../mutation-types";
import Docker from "@/utils/docker";

// Place to store command child processes run by projects
const commands = {};

const state = {
  commands: {},
  commandHistory: {},
  commandPointer: {},
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

  [types.ADD_TO_PROJECT_COMMAND_HISTORY](state, id) {
    const history = state.commandHistory[id] || [];
    history.push(state.commands[id]);
    state.commandHistory[id] = history;
  },

  [types.UPDATE_PROJECT_COMMAND_POINTER](state, { id, idx }) {
    Vue.set(state.commandPointer, id, idx);
  },

  [types.UPDATE_PROJECT_COMMAND_LOGS](state, { id, logs }) {
    Vue.set(state.logs, id, logs);
  },

  [types.UPDATE_PROJECT_COMMAND_RUNNING](state, { id, running }) {
    Vue.set(state.running, id, running);
  },

  [types.RESET_PROJECT_COMMAND_STATE](state) {
    state.commands = {};
    state.commandHistory = {};
    state.commandPointer = {};
    state.logs = {};
    state.running = {};
    state.services = {};
  }
};

const getters = {
  command: state => id => {
    return state.commands[id] || "";
  },

  logs: state => id => {
    return state.logs[id] || "";
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
      logs: state.logs[id] + logs
    });
  },

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

    // Record the current command
    commit(types.ADD_TO_PROJECT_COMMAND_HISTORY, id);

    // Update the command pointer to be able to cycle through
    commit(types.UPDATE_PROJECT_COMMAND_POINTER, {
      id,
      idx: state.commandHistory[id].length
    });

    // If running a command in an attached session, run mounted command instead
    if (getters.running(id)) {
      dispatch("runMounted", id);
      return;
    }

    // Update the logs
    commit(types.UPDATE_PROJECT_COMMAND_LOGS, {
      id,
      logs: `\r\n`
    });

    // Mark the command as running
    commit(types.UPDATE_PROJECT_COMMAND_RUNNING, { id, running: true });

    // Run the command
    commands[id] = Docker.run(project.dir, service, command.split(" "));

    // Clear the command
    commit(types.UPDATE_PROJECT_COMMAND_COMMAND, { id, command: "" });

    commands[id].on("data", data => {
      dispatch("addLogs", { id, logs: data.toString() });
    });

    // Clear the command when it's done
    commands[id].on("exit", data => {
      commit(types.UPDATE_PROJECT_COMMAND_RUNNING, { id, running: false });
    });

    return commands[id];
  },

  runMounted({ commit, dispatch, getters }, id) {
    const command = getters.command(id);

    // Provide clear functionality
    if (command === "clear") {
      commit(types.UPDATE_PROJECT_COMMAND_LOGS, { id, logs: "" });
      commit(types.UPDATE_PROJECT_COMMAND_COMMAND, { id, command: "" });
      return;
    }

    // Add to logs
    dispatch("addLogs", { id, logs: `$ ${command}\r\n` });

    // Run command via the stdin pipe
    commands[id].stdin.write(command + "\n");

    // Clear the command
    commit(types.UPDATE_PROJECT_COMMAND_COMMAND, { id, command: "" });
  },

  cancel(context, id) {
    commands[id].kill();
  },

  loadPreviousCommand({ commit, state }, id) {
    // Don't go less than zero
    if (!state.commandPointer[id]) return;

    // Update the pointer
    commit(types.UPDATE_PROJECT_COMMAND_POINTER, {
      id,
      idx: state.commandPointer[id] - 1
    });

    // Load the corresponding command
    commit(types.UPDATE_PROJECT_COMMAND_COMMAND, {
      id,
      command: state.commandHistory[id][state.commandPointer[id]]
    });
  },

  loadNextCommand({ commit, state }, id) {
    if (state.commandPointer[id] < state.commandHistory[id].length) {
      // Update the pointer
      commit(types.UPDATE_PROJECT_COMMAND_POINTER, {
        id,
        idx: state.commandPointer[id] + 1
      });

      // Load the corresponding command
      commit(types.UPDATE_PROJECT_COMMAND_COMMAND, {
        id,
        command: state.commandHistory[id][state.commandPointer[id]]
      });
    }
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
