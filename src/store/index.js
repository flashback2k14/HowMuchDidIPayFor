import Vue from "vue";
import Vuex from "vuex";
import { fb } from "../config/firebaseConfig";

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");
    store.dispatch("fetchUserSettings");
    store.dispatch("fetchUserBillings");
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    currentSetting: null,
    currentBillings: null,
    currentSelectedBilling: null,
    currentBillingEntries: [],
    userProfile: {},
    userSettings: [],
    userBillings: []
  },
  actions: {
    clearState({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
      commit("setUserSettings", []);
      commit("setUserBillings", []);
      commit("setCurrentSetting", null);
      commit("setCurrentBillings", null);
      commit("setCurrentSelectedBilling", null);
      commit("setCurrentBillingEntries", []);
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
          console.error(error);
        });
    },
    fetchUserBillings({ commit, state }) {
      fb.billings
        .where("userId", "==", state.currentUser.uid)
        .get()
        .then(res => {
          if (!res.empty) {
            commit("setUserBillings", res.docs);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchCurrentBillingEntries({ commit, state }) {
      fb.billingEntries
        .where("billingId", "==", state.currentSelectedBilling.id)
        .get()
        .then(res => {
          if (!res.empty) {
            commit("setCurrentBillingEntries", res.docs);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setCurrentSetting(state, val) {
      state.currentSetting = val;
    },
    setCurrentBillings(state, val) {
      state.currentBillings = val;
    },
    setCurrentSelectedBilling(state, val) {
      state.currentSelectedBilling = val;
    },
    setCurrentBillingEntries(state, val) {
      state.currentBillingEntries = val
        .map((item, index) => {
          let entry = item.data();
          entry.id = item.id;
          entry.pos = ++index;
          return entry;
        })
        .sort((a, b) => b.date.seconds - a.date.seconds);
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setUserSettings(state, val) {
      const settings = val
        .map((item, index) => {
          let setting = item.data();
          setting.id = item.id;
          setting.pos = ++index;
          return setting;
        })
        .sort((a, b) => b.pos - a.pos);
      state.userSettings = settings;
      state.currentSetting = settings.filter(
        item => item.expirationDate.seconds * 1000 > Date.now()
      )[0];
    },
    setUserBillings(state, val) {
      const billings = val
        .map((item, index) => {
          let billing = item.data();
          billing.id = item.id;
          billing.pos = ++index;
          return billing;
        })
        .sort((a, b) => b.year * 1000 + b.month - (a.year * 1000 + a.month));
      state.userBillings = billings;
      state.currentBillings = billings.filter(item => item.isPaid === false);
    }
  }
});
