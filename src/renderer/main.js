import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";
import Docker from "./utils/docker";

import "./assets/vars.scss";

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.docker = Vue.prototype.$docker = new Docker();
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>"
}).$mount("#app");

// Enable devtools in production - REMOVE
import { remote } from "electron";

remote.globalShortcut.register("CommandOrControl+Shift+K", () => {
  remote.BrowserWindow.getFocusedWindow().webContents.openDevTools();
});

window.addEventListener("beforeunload", () => {
  remote.globalShortcut.unregisterAll();
});
