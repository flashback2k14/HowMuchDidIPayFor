<template>
  <md-app md-waterfall md-mode="fixed-last">
    <md-app-toolbar class="md-large md-dense md-primary">
      <div class="md-toolbar-row">
        <md-icon>donut_large</md-icon>
        <div class="md-toolbar-section-start">
          <span class="md-title"> KEP </span>
        </div>

        <div class="md-toolbar-section-end">
          <span v-text="profileName"></span>
          <md-button
            class="md-icon-button"
            @click="logoutUser"
            :disabled="shouldDisableUiControls"
          >
            <md-icon>perm_identity</md-icon>
            <md-tooltip md-direction="bottom">Logout</md-tooltip>
          </md-button>
        </div>
      </div>

      <div class="md-toolbar-row">
        <md-tabs
          class="md-primary"
          md-sync-route
          :md-active-tab="setActiveTab()"
        >
          <md-tab
            id="tabDashboard"
            md-label="Übersicht"
            to="/dashboard"
            :md-disabled="shouldDisableUiControls"
          >
          </md-tab>
          <md-tab
            id="tabBillings"
            md-label="Abrechnungen"
            to="/billings"
            :md-disabled="shouldDisableUiControls"
          >
          </md-tab>
          <md-tab
            id="tabSettings"
            md-label="Einstellungen"
            to="/settings"
            :md-disabled="shouldDisableUiControls"
          >
          </md-tab>
        </md-tabs>
      </div>
    </md-app-toolbar>

    <md-app-content>
      <router-view />
      <!-- snackbar -->
      <md-snackbar
        :md-active.sync="showErrorSnackbar"
        :md-duration="Infinity"
        md-position="center"
        md-persistent
      >
        <span v-text="errorMessage"></span>
        <md-button class="md-primary" @click="closeErrorSnackbar();"
          >Schließen</md-button
        >
      </md-snackbar>
    </md-app-content>
  </md-app>
</template>

<script>
import { mapState } from "vuex";
import { ActionType, MutationType, StateProperty } from "@/helper";
import { auth } from "@/database";

export default {
  name: "App",
  computed: {
    ...mapState([
      StateProperty.CURRENT_USER,
      StateProperty.CURRENT_ERROR,
      StateProperty.USER_PROFILE
    ]),
    shouldDisableUiControls: function() {
      return this[StateProperty.CURRENT_USER] === null;
    },
    showErrorSnackbar: {
      get() {
        return this[StateProperty.CURRENT_ERROR] !== null;
      },
      set(newValue) {
        // Workaround, because VUE need a setter, but i didn't
      }
    },
    errorMessage: function() {
      return this[StateProperty.CURRENT_ERROR] !== null
        ? this[StateProperty.CURRENT_ERROR].message
        : null;
    },
    profileName: function() {
      return this[StateProperty.USER_PROFILE] !== null
        ? this[StateProperty.USER_PROFILE].name
        : null;
    }
  },
  methods: {
    async logoutUser() {
      try {
        await auth.logout();
        this.$store.dispatch(ActionType.CLEAR_STATE);
        this.$router.push("/login");
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    setActiveTab() {
      return this[StateProperty.CURRENT_USER] === null ? -1 : "tabDashboard";
    },
    closeErrorSnackbar() {
      this.$store.commit(MutationType.SET_CURRENT_ERROR, null);
    }
  }
};
</script>

<style>
.md-app {
  height: 100vh;
}
</style>
