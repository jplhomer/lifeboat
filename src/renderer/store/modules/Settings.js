import Project from "@/utils/project";
import settings from "electron-settings";

const state = {
  projects: settings.get("projects", []),
  hasAddedFirstProject: settings.get("hasAddedFirstProject", false)
};

const mutations = {
  ADD_PROJECT(state, project) {
    state.projects.push(project);
    settings.set("projects", state.projects);
  },
  REMOVE_PROJECT(state, projectId) {
    state.projects.splice(projectId, 1);
    settings.set("projects", state.projects);
  },
  UPDATE_PROJECT_VARIABLE(state, { id, idx, key, value }) {
    state.projects[id].variables[idx][key] = value;
    settings.set("projects", state.projects);
  },
  NEW_PROJECT_VARIABLE(state, { id }) {
    state.projects[id].variables.push({
      active: false,
      key: "",
      value: ""
    });
    settings.set("projects", state.projects);
  },
  REMOVE_PROJECT_VARIABLE(state, { id, idx }) {
    state.projects[id].variables.splice(idx, 1);
    settings.set("projects", state.projects);
  },
  UPDATE_SETTING(state, { key, value }) {
    state[key] = value;
    settings.set(key, value);
  }
};

const getters = {
  projects(state) {
    return state.projects.map((p, i) => new Project(p, i));
  }
};

const actions = {
  maybeMigrateProjectSchema({ getters, commit, state }) {
    if (state.projects.some(p => typeof p === "string")) {
      commit("UPDATE_SETTING", {
        key: "projects",
        value: getters.projects.map(p => p.toJson())
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
