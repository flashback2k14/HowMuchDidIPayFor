import Vue from "vue";
import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/black-green-dark.css";

import App from "./App";
import router from "./router";
import { store } from "./store";
import { auth } from "./config/firebaseConfig";
import registerServiceWorker from "./config/registerServiceWorker";

Vue.use(VueMaterial);
Vue.config.productionTip = false;

let app;

auth.onAuthStateChanged(user => {
  if (!app) {
    const formatter = new Intl.DateTimeFormat("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    Vue.filter("formattedDate", function(value) {
      if (!value) {
        return "";
      }
      if (value.seconds) {
        return formatter.format(new Date(value.seconds * 1000));
      }
      return formatter.format(new Date(value));
    });

    app = new Vue({
      el: "#app",
      router,
      store,
      render: h => h(App)
    });

    registerServiceWorker();
  }
});
