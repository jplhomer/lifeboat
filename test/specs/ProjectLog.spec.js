import { shallow, createLocalVue } from "vue-test-utils";
import Vuex from "vuex";
import ProjectLog from "@/components/Dashboard/ProjectLog";

const localVue = createLocalVue();
localVue.use(Vuex);

describe.skip("ProjectLog.vue", () => {
  let wrapper;
  let store;
  let getters;

  beforeEach(() => {
    getters = {
      projectLogs: () => () => "I really like this steak",
      projectLogFilters: () => () => [],
      projectActiveTab: () => () => "",
      activeProject: () => () => 0
    };

    store = new Vuex.Store({
      state: {},
      getters
    });

    wrapper = shallow(ProjectLog, {
      propsData: {
        project: { id: 0 }
      },
      localVue,
      store
    });
  });

  it("shows logs", () => {
    expect(wrapper.find(".log").text()).toBe(`I really like this steak`);
  });

  it("only shows logs matching active log filters", () => {
    getters.projectLogs = () => () =>
      `app_1 Starting up...
      resque_1 Also starting up...
      app_1 OK, ready!
    `;

    getters.projectLogFilters = () => () => ["app"];

    store = new Vuex.Store({
      state: {},
      getters
    });

    wrapper = shallow(ProjectLog, {
      propsData: {
        project: { id: 0 }
      },
      localVue,
      store
    });

    const text = wrapper.find(".log").text();

    expect(text).toBe(
      `app_1 Starting up...
      app_1 OK, ready!`
    );
  });
});
