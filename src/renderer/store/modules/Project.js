import settings from "electron-settings";
import * as types from "../mutation-types";
import DockerConfig from "@/utils/docker-config";
import Docker from "@/utils/docker";
import * as status from "@/utils/project-status";
import store from "@/store";

const PROJECTS_SCHEMA_VERSION = "1";
const SEP = process.platform === "win32" ? "\\" : "/";

let processes = {};

const state = {
  projectsSchemaVersion: settings.get("projectsSchemaVersion"),
  projects: [],
  terminalRows: 24,
  terminalCols: 80
};

const mutations = {
  [types.UPDATE_PROJECTS](state, projects) {
    state.projects = projects;
  },

  [types.REMOVE_PROJECT](state, projectId) {
    state.projects.splice(projectId, 1);
    settings.set("projects", state.projects.map(p => convertProjectToJSON(p)));
  },

  [types.UPDATE_PROJECT](state, [id, key, value]) {
    let p = state.projects[id];
    p[key] = value;
    state.projects.splice(id, 1, p);
  },

  [types.UPDATE_PROJECT_LOGS](state, { id, logs }) {
    let p = state.projects[id];
    p.logs = logs;
    state.projects.splice(id, 1, p);
  },

  [types.CLEAR_PROJECT_LOGS](state, id) {
    let p = state.projects[id];
    p.logs = "";
    state.projects.splice(id, 1, p);
  },

  [types.TOGGLE_PROJECT_LOG_FILTER](state, { id, service }) {
    let p = state.projects[id];
    let filters = p.logFilters;
    if (filters.includes(service)) {
      p.logFilters = filters.filter(f => f !== service);
    } else {
      p.logFilters.push(service);
    }
    state.projects.splice(id, 1, p);
  },

  [types.CLEAR_PROJECT_LOG_FILTERS](state, id) {
    let p = state.projects[id];
    p.logFilters = [];
    state.projects.splice(id, 1, p);
  },

  [types.RESIZE_TERMINAL](state, { cols, rows }) {
    state.terminalRows = rows;
    state.terminalCols = cols;
  }
};

const getters = {
  projects(state) {
    return state.projects;
  },

  projectRunning: (state, getters) => id => {
    return state.projects[id].services.every(s =>
      getters
        .containersForProject(id)
        .find(c => c.service === s && c.state === "running")
    );
  },

  projectPartiallyRunning: (state, getters) => id => {
    return getters.containersForProject(id).some(c => c.state === "running");
  },

  /**
   * Get the name of the app, formatted for Docker consumption
   */
  projectName: state => id => {
    return state.projects[id].dir
      .split(SEP)
      .pop()
      .replace(/-/g, "");
  },

  /**
   * Get the final name of the directory where the project lives
   */
  projectDirName: state => id => {
    return state.projects[id].dir.split(SEP).pop();
  },

  /**
   * Get string of project status (for CSS classes).
   * NOTE: This is different than the status set on the project
   * object. This is computed based on container status, while
   * the other one is set during start/stop/restart events.
   */
  projectStatus: (state, getters) => id => {
    if (state.projects[id].missingComposeFile) {
      return "stopped";
    }

    if (getters.projectRunning(id)) {
      return "running";
    }

    if (getters.projectPartiallyRunning(id)) {
      return "partial";
    }

    return "stopped";
  },

  /**
   * Get a project's active tab
   */
  projectActiveTab: state => id => {
    return state.projects[id].activeTab || "logs";
  },

  /**
   * Get a project's logs
   */
  projectLogs: state => id => {
    return state.projects[id].logs;
  },

  /**
   * Get a project's log filters
   */
  projectLogFilters: state => id => state.projects[id].logFilters,

  /**
   * Get a project's containers
   */
  containersForProject: (state, getters) => id => {
    const project = state.projects[id];
    return getters.containers
      .filter(c => c.project === getters.projectName(id))
      .filter(c => !c.temp)
      .filter(c => project.services.includes(c.service));
  }
};

const actions = {
  loadProjects({ commit, dispatch }) {
    // Clear the state of project commands to make sure
    // there is no leakage between projects
    dispatch("ProjectCommand/clearState");

    return new Promise((resolve, reject) => {
      // Fetch the JSON data persisted in storage
      let projects = settings.get("projects", []);

      projects.forEach((p, idx) => {
        // Build a list of service names based on the YML Compose file
        const config = new DockerConfig(p);
        p.missingComposeFile = !config.data;
        p.logs = "Click Start to see project logs";
        p.logFilters = [];
        p.services = config.services();
        p.isLogging = false;
        p.id = idx;

        // Watch the config for changes to the file
        config.onChange(() =>
          dispatch("updateProjectState", [p.id, "services", config.services()])
        );
      });

      commit(types.UPDATE_PROJECTS, projects);
      resolve();
    });
  },

  /**
   * Add project to settings, then reset state.
   */
  addProject({ dispatch, state }, dir) {
    settings.set(
      "projects",
      state.projects.map(p => convertProjectToJSON(p)).concat([{ dir }])
    );
    dispatch("loadProjects");
  },

  /**
   * Remove project from app, save it, and reset state.
   */
  removeProject({ commit, dispatch }, id) {
    commit(types.REMOVE_PROJECT, id);
    dispatch("loadProjects");
  },

  /**
   * Starts a project
   *
   * @param  {Int}  id          Project ID
   */
  async startProject({ dispatch, commit, state, getters }, id) {
    const p = state.projects[id];

    dispatch("setProjectStatus", { id, status: status.STARTING });
    commit(types.CLEAR_PROJECT_LOGS, id);

    try {
      await dispatch("startProjectProcess", {
        id,
        method: () => Docker.startProject(p.dir)
      });
      dispatch("setProjectStatus", { id, status: status.RUNNING });
      dispatch("startProjectLogs", id);
    } catch (e) {
      console.error(`Could not start project`, e);
      dispatch("setProjectStatus", { id, status: status.STOPPED });
    }
  },

  /**
   * Stops a project
   *
   * @param  {Int}  id          Project ID
   */
  async stopProject({ dispatch, commit, state, getters }, id) {
    const p = state.projects[id];

    dispatch("setProjectStatus", { id, status: status.STOPPING });

    try {
      await dispatch("startProjectProcess", {
        id,
        method: () => Docker.stopProject(p.dir)
      });
      dispatch("setProjectStatus", { id, status: status.STOPPED });
      dispatch("updateProjectState", [id, "isLogging", false]);
    } catch (e) {
      console.error(`Could not stop project`, e);
      dispatch("setProjectStatus", { id, status: status.STOPPED });
    }
  },

  /**
   * Builds and starts a project.
   *
   * @param {Int}  id           Project ID
   */
  async buildAndStartProject({ dispatch, commit }, id) {
    const p = state.projects[id];

    commit(types.CLEAR_PROJECT_LOGS, id);
    dispatch("setProjectStatus", { id, status: status.STARTING });

    try {
      await dispatch("startProjectProcess", {
        id,
        method: () => Docker.buildProject(p.dir)
      });
      dispatch("startProject", id);
    } catch (e) {
      console.error(`Could not build project`, e);
      dispatch("setProjectStatus", { id, status: status.STOPPED });
    }
  },

  /**
   * Builds and starts a project.
   *
   * @param {Int}  id           Project ID
   */
  async restartProject({ dispatch, commit }, id) {
    const p = state.projects[id];

    commit(types.CLEAR_PROJECT_LOGS, id);
    dispatch("setProjectStatus", { id, status: status.RESTARTING });

    try {
      await dispatch("startProjectProcess", {
        id,
        method: () => Docker.restartProject(p.dir)
      });
      // For some reason, the logs persist from the previous running app?
      // So we don't need to call startLogs() again.
      dispatch("setProjectStatus", { id, status: status.RUNNING });
      dispatch("fetchContainers");
      dispatch("startProjectLogs", id);
    } catch (e) {
      console.error(`Could not restart project`, e);
    }
  },

  /**
   * Set a project's status to a new status.
   */
  setProjectStatus({ commit }, { id, status }) {
    commit(types.UPDATE_PROJECT, [id, "status", status]);
  },

  /**
   * Start's a process for the project. Accepts the ID and a method
   * closure which will be assigned to listeners.
   * @returns Promise that is resolved is process is successful, or
   * rejects if not.
   */
  startProjectProcess({ dispatch, commit, state }, { id, method }) {
    dispatch("stopLoggingProcess", id);

    processes[id] = method.call();

    dispatch("logProcess", id);

    return new Promise((resolve, reject) => {
      processes[id].on("exit", signal => {
        if (signal === 1) {
          reject();
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Log the process for a given project
   */
  logProcess({ dispatch }, id) {
    processes[id].on("data", d =>
      dispatch("appendProjectLogs", { id, logs: d })
    );
  },

  /**
   * Stop logging the process for a given project by killing it
   */
  stopLoggingProcess({ dispatch }, id) {
    if (processes[id]) processes[id].kill();
  },

  /**
   * Append to a project's logs
   */
  appendProjectLogs({ getters, commit }, { id, logs }) {
    commit(types.UPDATE_PROJECT_LOGS, {
      id,
      logs: getters.projectLogs(id) + logs
    });
  },

  /**
   * Clear project logs
   */
  clearProjectLogs({ commit }, id) {
    commit(types.CLEAR_PROJECT_LOGS, id);
  },

  /**
   * Begin a Docker Compose logging process for a project
   */
  startProjectLogs({ dispatch, state }, id) {
    dispatch("stopLoggingProcess", id);

    const p = state.projects[id];
    processes[id] = Docker.logs(p.dir);
    dispatch("updateProjectState", [id, "isLogging", true]);
    dispatch("logProcess", id);
  },

  /**
   * Toggle a project's log filter
   */
  toggleProjectLogFilter({ commit }, payload) {
    commit(types.TOGGLE_PROJECT_LOG_FILTER, payload);
  },

  clearProjectLogFilters({ commit }, id) {
    commit(types.CLEAR_PROJECT_LOG_FILTERS, id);
  },

  migrateProjectSchema({ getters, commit, state }) {
    if (state.projectsSchemaVersion !== PROJECTS_SCHEMA_VERSION) {
      commit("UPDATE_SETTING", {
        key: "projects",
        value: getters.projects.map(p => convertProjectToJSON(p))
      });

      commit("UPDATE_SETTING", {
        key: "projectsSchemaVersion",
        value: PROJECTS_SCHEMA_VERSION
      });
    }
  },

  updateProjectState({ commit }, payload) {
    commit(types.UPDATE_PROJECT, payload);
  },

  projectResizeTerminal({ commit }, payload) {
    commit(types.RESIZE_TERMINAL, payload);
    Object.keys(processes).forEach(key => {
      if (processes[key]) processes[key].resize(payload.cols, payload.rows);
    });
  }
};

/**
 * Returns an object representation of a project for saving to the DB.
 * @param {Object} Project state
 */
function convertProjectToJSON(project) {
  return {
    dir: project.dir
  };
}

export default {
  state,
  mutations,
  getters,
  actions
};
