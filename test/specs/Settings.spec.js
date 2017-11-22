import { createLocalVue, shallow } from "vue-test-utils";
import Vuex from "vuex";
import Settings from "@/components/Settings";
import Grid from "@/components/Grid";
import * as fs from "fs";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Settings.vue", () => {
  let store;
  let wrapper;
  let mutations;
  let actions;

  beforeEach(() => {
    mutations = {
      UPDATE_SETTING: sinon.stub()
    };

    actions = {
      addProject: sinon.spy()
    };

    store = new Vuex.Store({
      state: {
        Settings: {
          hasAddedFirstProject: false
        }
      },
      getters: {
        projects: () => []
      },
      actions,
      mutations
    });

    wrapper = shallow(Settings, {
      localVue,
      store,
      stubs: {
        grid: Grid
      }
    });
  });

  it("should show welcome message if no projects exist", () => {
    expect(wrapper.find(".notification")).toBeTruthy();
    expect(wrapper.find(".notification").text()).toContain("Let's get started");
  });

  it("should show initial getting started message after first project added", () => {
    let fsStatSync = sinon.stub(fs, "statSync").returns({
      isDirectory: () => true
    });

    wrapper.vm.addProject("foo");
    fsStatSync.restore();

    expect(actions.addProject.called).toBe(true);
    expect(mutations.UPDATE_SETTING.called).toBe(true);
    expect(mutations.UPDATE_SETTING.args[0][1]).toEqual({
      key: "hasAddedFirstProject",
      value: true
    });

    wrapper.update();

    expect(wrapper.find(".first-time-message").text()).toContain("Great work!");
  });
});
