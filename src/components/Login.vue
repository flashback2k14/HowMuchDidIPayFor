<template>
  <div
    class="md-layout md-gutter login-container_height"
    :class="`md-alignment-center-center`"
  >
    <div class="md-layout-item md-size-50 md-small-size-100">
      <form novalidate class="md-layout" @submit.prevent="validateUser">
        <md-card class="md-layout-item" md-with-hover>
          <md-card-header> <div class="md-title">Login</div> </md-card-header>

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
          </md-card-content>

          <md-progress-bar
            class="md-accent"
            md-mode="indeterminate"
            v-if="sending"
          />

          <md-card-actions>
            <md-button type="submit" class="md-primary" :disabled="sending">
              Login
            </md-button>
          </md-card-actions>
        </md-card>
      </form>
    </div>
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
          this.sending = false;
          this.$router.push("/dashboard");
        })
        .catch(error => {
          console.error(error);
          this.sending = false;
        });
    }
  }
};
</script>

<style>
.login-container_height {
  height: inherit;
}
</style>
