import Vue from "vue";
import Settings from "@/components/Settings";

describe("Settings.vue", () => {
  it("should render correct contents", () => {
    const vm = new Vue({
      el: document.createElement("div"),
      render: h => h(Settings)
    }).$mount();

    console.log(vm.$el);

    expect(vm.$el.querySelector(".title").textContent).to.contain(
      "Welcome to your new project!"
    );
  });
});
