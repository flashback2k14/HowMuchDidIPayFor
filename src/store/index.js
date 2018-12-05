import Vue from "vue";
import Vuex from "vuex";
import { fb } from "../config/firebaseConfig";
import { extendDocuments, ActionType, MutationType } from "../helper";

Vue.use(Vuex);

fb.auth.onAuthStateChanged(user => {
  if (user) {
    store.commit(MutationType.SET_CURRENT_USER, user);
    store.dispatch(ActionType.FETCH_USER_PROFILE);
    store.dispatch(ActionType.FETCH_USER_SETTINGS);
    store.dispatch(ActionType.FETCH_USER_BILLINGS);
  } else {
    store.dispatch(ActionType.CLEAR_STATE);
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
      commit(MutationType.SET_CURRENT_USER, null);
      commit(MutationType.SET_CURRENT_SETTING, null);
      commit(MutationType.SET_CURRENT_BILLINGS, null);
      commit(MutationType.SET_CURRENT_SELECTED_BILLING, null);
      commit(MutationType.SET_CURRENT_BILLING_ENTRIES, []);
      commit(MutationType.SET_USER_PROFILE, {});
      commit(MutationType.SET_USER_SETTINGS, []);
      commit(MutationType.SET_USER_BILLINGS, []);
    },
    fetchUserProfile({ commit, state }) {
      fb.users
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          if (res.exists) {
            commit(MutationType.SET_USER_PROFILE, res.data());
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
            const docs = extendDocuments(res.docs);
            commit(MutationType.SET_CURRENT_SETTING, docs);
            commit(MutationType.SET_USER_SETTINGS, docs);
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
            const docs = extendDocuments(res.docs);
            commit(MutationType.SET_CURRENT_BILLINGS, docs);
            commit(MutationType.SET_USER_BILLINGS, docs);
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    fetchUserBillingEntriesForSelection({ commit, state }) {
      fb.billingEntries
        .where("billingId", "==", state.currentSelectedBilling.id)
        .get()
        .then(res => {
          if (!res.empty) {
            commit(MutationType.SET_CURRENT_BILLING_ENTRIES, res.docs);
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setCurrentSetting(state, docs) {
      state.currentSetting =
        docs === null
          ? null
          : docs.filter(
              item => item.expirationDate.seconds * 1000 > Date.now()
            )[0];
    },
    setCurrentBillings(state, docs) {
      state.currentBillings =
        docs === null ? null : docs.filter(item => item.isPaid === false);
    },
    setCurrentSelectedBilling(state, selectedBilling) {
      state.currentSelectedBilling = selectedBilling;
    },
    setCurrentBillingEntries(state, docs) {
      state.currentBillingEntries = extendDocuments(docs).sort(
        (a, b) => b.date.seconds - a.date.seconds
      );
    },
    setUserProfile(state, profile) {
      state.userProfile = profile;
    },
    setUserSettings(state, docs) {
      state.userSettings = docs.sort((a, b) => b.pos - a.pos);
    },
    setUserBillings(state, docs) {
      state.userBillings = docs.sort(
        (a, b) => b.year * 1000 + b.month - (a.year * 1000 + a.month)
      );
    }
  }
});
