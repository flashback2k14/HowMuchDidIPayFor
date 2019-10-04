import Vue from "vue";
import Vuex from "vuex";
import {
  convertDocument,
  setDocumentPosition,
  immutableSort,
  ActionType,
  MutationType
} from "./../helper";
import { auth } from "./../config/firebaseConfig";
import { reader } from "./../database";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentUser: null,
    currentSetting: null,
    currentBillings: null,
    currentBillingIntervals: null,
    currentBillingCoveredDays: {},
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
      commit(MutationType.SET_CURRENT_BILLING_INTERVALLS, null);
      commit(MutationType.SET_CURRENT_BILLING_COVERED_DAYS, {});
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
        const result = await reader.profile(state.currentUser.uid);
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
        const result = await reader.settings(state.currentUser.uid);
        if (result.empty) {
          return;
        }
        const docs = convertDocument(result.docs);
        commit(MutationType.SET_CURRENT_SETTING, docs);
        commit(MutationType.SET_USER_SETTINGS, docs);
      } catch (error) {
        commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    async fetchUserBillings({ commit, state }) {
      try {
        const result = await reader.billings(state.currentUser.uid);
        if (result.empty) {
          return;
        }
        const docs = convertDocument(result.docs);
        commit(MutationType.SET_CURRENT_BILLINGS, docs);
        commit(MutationType.SET_CURRENT_BILLING_INTERVALLS, docs);
        commit(MutationType.SET_CURRENT_BILLING_COVERED_DAYS, docs);
        commit(MutationType.SET_USER_BILLINGS, docs);
      } catch (error) {
        commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    async fetchUserBillingEntriesForSelection({ commit, state }) {
      try {
        const result = await reader.billingEntries(
          state.currentSelectedBilling.id
        );
        if (result.empty) {
          return;
        }
        const docs = convertDocument(result.docs);
        commit(MutationType.SET_CURRENT_BILLING_ENTRIES, docs);
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
    setCurrentBillingIntervalls(state, docs) {
      state.currentBillingIntervals =
        docs === null
          ? [{ text: "", value: "" }]
          : docs
              .filter(item => item.isPaid === false)
              .map(billing => {
                return {
                  text: `${billing.month}.${billing.year}`,
                  value: billing.id
                };
              });
    },
    setCurrentBillingCoveredDays(state, docs) {
      if (!docs) {
        return null;
      }

      docs
        .filter(item => item.isPaid === false)
        .forEach(billing => {
          state.currentBillingCoveredDays[billing.id] =
            billing.coveredDays || [];
        });
    },
    setCurrentSelectedBilling(state, selectedBilling) {
      state.currentSelectedBilling = selectedBilling;
    },
    setCurrentBillingEntries(state, docs) {
      state.currentBillingEntries = setDocumentPosition(
        immutableSort(docs, (a, b) => b.date.seconds - a.date.seconds)
      );
    },
    setCurrentError(state, error) {
      state.currentError = error;
    },
    setUserProfile(state, profile) {
      state.userProfile = profile;
    },
    setUserSettings(state, docs) {
      state.userSettings = setDocumentPosition(
        immutableSort(
          docs,
          (a, b) => b.expirationDate.seconds - a.expirationDate.seconds
        )
      );
    },
    setUserBillings(state, docs) {
      state.userBillings = setDocumentPosition(
        immutableSort(
          docs,
          (a, b) => b.year * 1000 + b.month - (a.year * 1000 + a.month)
        )
      );
    }
  }
});

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

export default store;
