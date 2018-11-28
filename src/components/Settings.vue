<template>
  <div>
    <!-- data table -->
    <md-table :value="userSettings" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Position" md-numeric>{{
          item.pos
        }}</md-table-cell>
        <md-table-cell md-label="Breakfast Prize" md-numeric>{{
          item.breakfastPrize
        }}</md-table-cell>
        <md-table-cell md-label="Lunch Prize" md-numeric>{{
          item.lunchPrize
        }}</md-table-cell>
        <md-table-cell md-label="Afternoon Snack Prize" md-numeric>{{
          item.afternoonSnackPrize
        }}</md-table-cell>
        <md-table-cell md-label="Expiration Date">{{
          item.expirationDate | formattedDate
        }}</md-table-cell>
      </md-table-row>
    </md-table>
    <!-- dialog -->
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Create a new Setting</md-dialog-title>
      <form novalidate @submit.prevent="createSetting">
        <md-dialog-content>
          <md-field>
            <label>Preis für Frühstück</label>
            <md-input
              type="number"
              name="breakfastPrize"
              id="breakfastPrize"
              v-model.trim="form.breakfastPrize"
              min="0.05"
              step="0.10"
            ></md-input>
            <span class="md-suffix">Euro</span>
          </md-field>
          <md-field>
            <label>Preis für Mittagessen</label>
            <md-input
              type="number"
              name="lunchPrize"
              id="lunchPrize"
              v-model.trim="form.lunchPrize"
              min="0.05"
              step="0.10"
            ></md-input>
            <span class="md-suffix">Euro</span>
          </md-field>
          <md-field>
            <label>Preis für Frühstück</label>
            <md-input
              type="number"
              name="afternoonSnackPrize"
              id="afternoonSnackPrize"
              v-model.trim="form.afternoonSnackPrize"
              min="0.05"
              step="0.10"
            ></md-input>
            <span class="md-suffix">Euro</span>
          </md-field>
          <md-datepicker v-model.trim="form.expirationDate">
            <label>Gültig bis</label>
          </md-datepicker>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="closeDialog();"
            >Close</md-button
          >
          <md-button class="md-primary" type="submit">Save</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
    <!-- fab -->
    <div class="container-button">
      <md-button class="md-fab" @click="showDialog = !showDialog;">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { fb } from "../config/firebaseConfig.js";

const formatter = new Intl.DateTimeFormat("de-DE", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

const formattedDateFilter = function(value) {
  return formatter.format(new Date(value.seconds * 1000));
};

export default {
  name: "Settings",
  data() {
    return {
      showDialog: false,
      form: {
        breakfastPrize: null,
        lunchPrize: null,
        afternoonSnackPrize: null,
        expirationDate: null
      }
    };
  },
  computed: {
    ...mapState(["userSettings", "currentUser"])
  },
  filters: {
    formattedDate: formattedDateFilter
  },
  methods: {
    closeDialog() {
      this.form.breakfastPrize = null;
      this.form.lunchPrize = null;
      this.form.afternoonSnackPrize = null;
      this.form.expirationDate = null;
      this.showDialog = !this.showDialog;
    },
    createSetting() {
      fb.settings
        .add({
          breakfastPrize: this.form.breakfastPrize,
          lunchPrize: this.form.lunchPrize,
          afternoonSnackPrize: this.form.afternoonSnackPrize,
          expirationDate: this.form.expirationDate,
          userId: this.currentUser.uid
        })
        .then(res => {
          this.$store.dispatch("fetchUserSettings");
          this.closeDialog();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style>
.container-button {
  position: absolute;
  bottom: 12px;
  left: calc(50vw - 56px);
}
/* Smartphones (portrait and landscape) ----------- */
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .container-button {
    left: calc(50vw - 36px);
  }
}
</style>
