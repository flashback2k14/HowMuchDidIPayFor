import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/black-green-dark.css";

import App from "./App";
import router from "./router";
import { store } from "./store";
import { fb } from "./config/firebaseConfig";

Vue.use(VueMaterial);
Vue.config.productionTip = false;

let app;

fb.auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: "#app",
      router,
      store,
      render: h => h(App)
    });
  }
});
