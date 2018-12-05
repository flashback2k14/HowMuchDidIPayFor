<template>
  <md-app md-waterfall md-mode="fixed-last">
    <md-app-toolbar class="md-large md-dense md-primary">
      <div class="md-toolbar-row">
        <md-icon>donut_large</md-icon>
        <div class="md-toolbar-section-start">
          <span class="md-title"> KEP </span>
        </div>

        <div class="md-toolbar-section-end">
          {{ userProfile.name }}
          <md-button
            class="md-icon-button"
            @click="logoutUser"
            :disabled="!currentUser"
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
            :md-disabled="!currentUser"
          >
          </md-tab>
          <md-tab
            id="tabBillings"
            md-label="Abrechnungen"
            to="/billings"
            :md-disabled="!currentUser"
          >
          </md-tab>
          <md-tab
            id="tabSettings"
            md-label="Einstellungen"
            to="/settings"
            :md-disabled="!currentUser"
          >
          </md-tab>
        </md-tabs>
      </div>
    </md-app-toolbar>

    <md-app-content> <router-view /> </md-app-content>
  </md-app>
</template>

<script>
import { mapState } from "vuex";
import { fb } from "./config/firebaseConfig";
import { ActionType } from "./helper";

export default {
  name: "App",
  computed: {
    ...mapState(["currentUser", "userProfile"])
  },
  methods: {
    logoutUser() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch(ActionType.CLEAR_STATE);
          this.$router.push("/login");
        })
        .catch(error => {
          console.error(error);
        });
    },
    setActiveTab() {
      return this.currentUser === null ? -1 : "tabDashboard";
    }
  }
};
</script>

<style>
.md-app {
  height: 100vh;
}
</style>
