import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/settings",
      name: "settings",
      component: require("@/components/Settings")
    },
    {
      path: "/:project_id",
      component: require("@/components/Dashboard"),
      children: [
        {
          path: "",
          component: require("@/components/Dashboard/Log")
        },
        {
          path: "log",
          component: require("@/components/Dashboard/Log")
        },
        {
          path: "about",
          component: require("@/components/Dashboard/Readme")
        }
      ]
    },
    {
      path: "*",
      redirect: "/settings"
    }
  ]
});
