import Project from "@/utils/project";
import settings from "@/utils/settings";

const state = {
  projects: []
};

const mutations = {
  SET_INITIAL_PROJECTS(state, projects) {
    state.projects = projects;
  },
  ADD_PROJECT(state, project) {
    state.projects.push(project);
    settings.save({ projects: state.projects });
  },
  REMOVE_PROJECT(state, projectId) {
    state.projects.splice(projectId, 1);
    settings.save({ projects: state.projects });
  }
};

const actions = {
  loadInitialProjects({ commit }) {
    commit("SET_INITIAL_PROJECTS", settings.load().projects || []);
  }
};

const getters = {
  activeProject(state, getters) {
    return getters.projects.filter(p => p.active())[0];
  },
  projects(state) {
    return state.projects.map((p, i) => new Project(p, i));
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
