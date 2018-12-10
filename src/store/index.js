import Vue from "vue";
import Vuex from "vuex";
import { extendDocuments, ActionType, MutationType } from "@/helper";
import { getter } from "@/database";
import { auth } from "@/config/firebaseConfig";

Vue.use(Vuex);

auth.onAuthStateChanged(user => {
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
    currentError: null,
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
      commit(MutationType.SET_CURRENT_ERROR, null);
      commit(MutationType.SET_USER_PROFILE, {});
      commit(MutationType.SET_USER_SETTINGS, []);
      commit(MutationType.SET_USER_BILLINGS, []);
    },
    clearError({ commit }) {
      commit(MutationType.SET_CURRENT_ERROR, null);
    },
    async fetchUserProfile({ commit, state }) {
      try {
        const result = await getter.profile(state.currentUser.uid);
        if (!result.exists) {
          commit(MutationType.SET_CURRENT_ERROR, {
            message: "Es wurde kein Benutzerprofil gefunden."
          });
          return;
        }
        commit(MutationType.SET_USER_PROFILE, result.data());
      } catch (error) {
        commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    async fetchUserSettings({ commit, state }) {
      try {
        const result = await getter.settings(state.currentUser.uid);
        if (result.empty) {
          return;
        }
        const docs = extendDocuments(result.docs);
        commit(MutationType.SET_CURRENT_SETTING, docs);
        commit(MutationType.SET_USER_SETTINGS, docs);
      } catch (error) {
        commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    async fetchUserBillings({ commit, state }) {
      try {
        const result = await getter.billings(state.currentUser.uid);
        if (result.empty) {
          return;
        }
        const docs = extendDocuments(result.docs);
        commit(MutationType.SET_CURRENT_BILLINGS, docs);
        commit(MutationType.SET_USER_BILLINGS, docs);
      } catch (error) {
        commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    async fetchUserBillingEntriesForSelection({ commit, state }) {
      try {
        const result = await getter.billingEntries(
          state.currentSelectedBilling.id
        );
        if (result.empty) {
          return;
        }
        commit(MutationType.SET_CURRENT_BILLING_ENTRIES, result.docs);
      } catch (error) {
        commit(MutationType.SET_CURRENT_ERROR, error);
      }
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
    setCurrentError(state, error) {
      state.currentError = error;
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
