<template>
  <div class="md-layout md-alignment-center-center login-container_height">
    <div class="md-layout-item md-size-50 md-small-size-100">
      <form novalidate @submit.prevent="handleUserLogin">
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
                :disabled="flags.waitingForRequestAnswer"
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
                :disabled="flags.waitingForRequestAnswer"
              />
            </md-field>

            <md-progress-bar
              class="md-accent"
              md-mode="indeterminate"
              v-if="flags.waitingForRequestAnswer"
            />
          </md-card-content>

          <md-card-actions>
            <md-button
              type="submit"
              class="md-primary"
              :disabled="flags.waitingForRequestAnswer"
              >Anmeldung</md-button
            >
          </md-card-actions>
        </md-card>
      </form>
    </div>
  </div>
</template>

<script>
import { ActionType, MutationType } from "./../helper";
import { auth } from "./../database";

export default {
  name: "Login",
  data: () => ({
    form: {
      email: null,
      password: null
    },
    flags: {
      waitingForRequestAnswer: false
    }
  }),
  methods: {
    async handleUserLogin() {
      this.flags.waitingForRequestAnswer = true;
      try {
        const result = await auth.login(this.form);
        this.$store.commit(MutationType.SET_CURRENT_USER, result.user);
        this.$store.dispatch(ActionType.FETCH_USER_PROFILE);
        this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
        this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
        this.flags.waitingForRequestAnswer = false;
        this.$router.push("/dashboard");
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
        this.flags.waitingForRequestAnswer = false;
      }
    }
  }
};
</script>

<style>
.login-container_height {
  height: inherit;
}
</style>
