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
      path: "/dashboard/:id",
      component: require("@/components/Dashboard"),
      name: "dashboard"
    },
    {
      path: "*",
      redirect: "/dashboard/0"
    }
  ]
});
