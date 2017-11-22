import { shallow, createLocalVue } from "vue-test-utils";
import ProjectService from "@/components/Dashboard/ProjectService";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ProjectService.vue", () => {
  let wrapper;
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {},
      getters: {
        projectLogFilters: () => () => []
      }
    });

    wrapper = shallow(ProjectService, {
      propsData: {
        project: {
          id: 0
        }
      },
      localVue,
      store
    });
  });

  it("should show ports if available in the container", () => {
    wrapper.setComputed({
      ports: [3000]
    });

    expect(wrapper.findAll(".tags > span")).toHaveLength(1);
    expect(wrapper.find(".tags > span").text()).toBe("3000");
  });
});
