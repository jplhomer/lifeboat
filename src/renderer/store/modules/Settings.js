import settings from "electron-settings";

const state = {
  hasAddedFirstProject: settings.get("hasAddedFirstProject", false)
};

const mutations = {
  UPDATE_SETTING(state, { key, value }) {
    state[key] = value;
    settings.set(key, value);
  }
};

export default {
  state,
  mutations
};
