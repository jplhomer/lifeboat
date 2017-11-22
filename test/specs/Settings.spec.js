import { createLocalVue, shallow } from "vue-test-utils";
import Vuex from "vuex";
import Settings from "@/components/Settings";
import Grid from "@/components/Grid";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Settings.vue", () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      getters: {
        projects: () => []
      }
    });
  });

  it("should show welcome message if no projects exist", () => {
    let wrapper = shallow(Settings, {
      localVue,
      store,
      stubs: {
        grid: Grid
      }
    });

    expect(wrapper.find(".notification")).toBeTruthy();

    expect(wrapper.find(".notification").text()).toContain("Let's get started");
  });
});
