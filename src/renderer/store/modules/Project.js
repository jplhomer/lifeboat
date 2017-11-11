import Project from "@/utils/project";
import settings from "electron-settings";
import * as types from "../mutation-types";

const PROJECTS_SCHEMA_VERSION = "1";

const state = {
  projectsSchemaVersion: settings.get("projectsSchemaVersion"),
  projects: []
};

const mutations = {
  [types.UPDATE_PROJECTS](state, projects) {
    state.projects = projects;
  },

  [types.ADD_PROJECT](state, dir) {
    const project = new Project(dir, state.projects.length);
    state.projects.push(project.toJson());
    settings.set("projects", state.projects);
  },

  [types.REMOVE_PROJECT](state, projectId) {
    state.projects.splice(projectId, 1);
    settings.set("projects", state.projects);
  }
};

const getters = {
  projects(state) {
    return state.projects.map((p, i) => new Project(p, i));
  }
};

const actions = {
  loadProjects({ commit }) {
    const projects = settings.get("projects", []);
    commit(types.UPDATE_PROJECTS, projects);
  },

  migrateProjectSchema({ getters, commit, state }) {
    if (state.projectsSchemaVersion !== PROJECTS_SCHEMA_VERSION) {
      commit("UPDATE_SETTING", {
        key: "projects",
        value: getters.projects.map(p => p.toJson())
      });

      commit("UPDATE_SETTING", {
        key: "projectsSchemaVersion",
        value: PROJECTS_SCHEMA_VERSION
      });
    }
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
