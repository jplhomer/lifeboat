import Vue from "vue";
import axios from "axios";

import App from "./App";
import router from "./router";
import store from "./store";
import db from "./datastore";
import Docker from "./utils/docker";

import "bulma/css/bulma.css";

// import fs from 'fs'
// import path from 'path'
// import { remote } from 'electron'

if (!process.env.IS_WEB) Vue.use(require("vue-electron"));
Vue.http = Vue.prototype.$http = axios;
Vue.docker = Vue.prototype.$docker = new Docker();
Vue.config.productionTip = false;
Vue.prototype.$db = db;

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: "<App/>"
}).$mount("#app");

// console.log(fs.readdirSync(path.join(remote.app.getPath('documents'), 'Sites', 'aheinz')))
