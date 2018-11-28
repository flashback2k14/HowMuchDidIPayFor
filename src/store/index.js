import Vue from "vue";
import Vuex from "vuex";
import { fb } from "../config/firebaseConfig";

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");
    store.dispatch("fetchUserSettings");
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    currentSettings: null,
    userProfile: {},
    userSettings: []
  },
  actions: {
    clearState({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
      commit("setUserSettings", []);
    },
    fetchUserProfile({ commit, state }) {
      fb.users
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          if (res.exists) {
            commit("setUserProfile", res.data());
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchUserSettings({ commit, state }) {
      fb.settings
        .where("userId", "==", state.currentUser.uid)
        .get()
        .then(res => {
          if (!res.empty) {
            commit("setUserSettings", res.docs);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setUserSettings(state, val) {
      const settings = val.map(item => item.data());
      state.userSettings = settings;
      state.currentSettings = settings.filter(
        item => item.expirationDate.seconds * 1000 > Date.now()
      )[0];
    }
  }
});
