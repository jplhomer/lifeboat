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
      path: "/",
      name: "dashboard",
      component: require("@/components/Dashboard")
    },
    {
      path: "*",
      redirect: "/settings"
    }
  ]
});
