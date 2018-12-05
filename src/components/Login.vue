<template>
  <div class="md-layout md-alignment-center-center login-container_height">
    <!-- login control -->
    <div class="md-layout-item md-size-50 md-small-size-100">
      <form novalidate @submit.prevent="validateUser">
        <md-card md-with-hover>
          <md-card-header>
            <div class="md-title">Login</div>
            <md-divider></md-divider>
          </md-card-header>

          <md-card-content>
            <md-field>
              <label for="email">Email</label>
              <md-input
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                v-model.trim="form.email"
                :disabled="sending"
              />
            </md-field>

            <md-field>
              <label for="password">Password</label>
              <md-input
                type="password"
                name="password"
                id="password"
                autocomplete="password"
                v-model.trim="form.password"
                :disabled="sending"
              />
            </md-field>

            <md-progress-bar
              class="md-accent"
              md-mode="indeterminate"
              v-if="sending"
            />
          </md-card-content>

          <md-card-actions>
            <md-button type="submit" class="md-primary" :disabled="sending">
              Login
            </md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
    <!-- snackbar -->
    <md-snackbar
      :md-active.sync="errors.showSnackbar"
      :md-duration="Infinity"
      md-position="center"
      md-persistent
    >
      <span>{{ errors.message }}</span>
      <md-button class="md-primary" @click="closeErrorSnackbar();"
        >Schließen</md-button
      >
    </md-snackbar>
  </div>
</template>

<script>
import { fb } from "../config/firebaseConfig.js";

export default {
  name: "Login",
  data: () => ({
    form: {
      email: null,
      password: null
    },
    errors: {
      showSnackbar: false,
      message: null
    },
    sending: false
  }),
  methods: {
    validateUser() {
      this.sending = true;
      fb.auth
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(result => {
          this.$store.commit("setCurrentUser", result.user);
          this.$store.dispatch("fetchUserProfile");
          this.$store.dispatch("fetchUserSettings");
          this.$store.dispatch("fetchUserBillings");
          this.sending = false;
          this.$router.push("/dashboard");
        })
        .catch(error => {
          console.error(error);
          this.errors.message = error.message;
          this.errors.showSnackbar = true;
          this.sending = false;
        });
    },
    closeErrorSnackbar() {
      this.errors.showSnackbar = false;
      this.errors.message = null;
    }
  }
};
</script>

<style>
.login-container_height {
  height: inherit;
}
</style>
