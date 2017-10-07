import Project from "@/utils/project";
import settings from "@/utils/settings";

const state = settings.load() || {
  projects: []
};

const mutations = {
  ADD_PROJECT(state, project) {
    (state.projects || []).push(project);
    settings.save(state);
  },
  REMOVE_PROJECT(state, projectId) {
    state.projects.splice(projectId, 1);
    settings.save(state);
  },
  UPDATE_SETTING(state, { key, value }) {
    state[key] = value;
    settings.save(state);
  }
};

const getters = {
  projects(state) {
    return (state.projects || []).map((p, i) => new Project(p, i));
  }
};

export default {
  state,
  mutations,
  getters
};
