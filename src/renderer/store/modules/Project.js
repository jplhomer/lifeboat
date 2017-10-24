import Project from "@/utils/project";
import settings from "electron-settings";

const PROJECTS_SCHEMA_VERSION = "1";

const state = {
  projectsSchemaVersion: settings.get("projectsSchemaVersion"),
  projects: settings.get("projects", [])
};

const mutations = {
  ADD_PROJECT(state, project) {
    state.projects.push(project);
    settings.set("projects", state.projects);
  },
  REMOVE_PROJECT(state, projectId) {
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
  maybeMigrateProjectSchema({ getters, commit, state }) {
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
