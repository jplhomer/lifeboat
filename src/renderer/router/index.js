import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  linkActiveClass: "is-active",
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
          path: "log",
          component: require("@/components/Dashboard/LogTab")
        },
        {
          path: "about",
          component: require("@/components/Dashboard/ReadmeTab")
        },
        {
          path: "command",
          component: require("@/components/Dashboard/CommandTab")
        }
      ]
    },
    {
      path: "*",
      redirect: "/settings"
    }
  ]
});
