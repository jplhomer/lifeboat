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

export default {
  state,
  mutations,
  getters
};
