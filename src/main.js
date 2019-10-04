import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/black-green-dark.css";

import App from "./App";
import router from "./router";
import store from "./store";
import { auth } from "./config/firebaseConfig";
import registerServiceWorker from "./config/registerServiceWorker";
import "./filters";

Vue.use(VueMaterial);
Vue.config.productionTip = false;

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      render: h => h(App)
    });
    registerServiceWorker();
  }
});

// TODO
//  - Archive Billings and Entries
