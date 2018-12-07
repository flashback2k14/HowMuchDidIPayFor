<template>
  <div class="md-layout md-alignment-top-center dashboard-container_height">
    <div class="md-layout-item md-size-95">
      <div v-if="currentBillings === null || currentBillings.length === 0">
        <md-empty-state
          md-icon="block"
          md-label="Dashboard"
          md-description="There is currently no data avialable."
        >
        </md-empty-state>
      </div>
      <div v-else v-for="item in currentBillings" :key="item.id">
        <md-card class="card-margin_bottom">
          <md-card-header>
            <div class="md-title">
              Abrechnung {{ item.month }}.{{ item.year }}
            </div>
            <md-divider></md-divider>
          </md-card-header>

          <md-card-content>
            <md-field>
              <label>Aktueller Betrag</label>
              <md-input v-model="item.currentSaldo" disabled></md-input>
              <span class="md-suffix">Euro</span>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button @click="setBillingAsPaid(item);"
              >Abrechnung abschließen</md-button
            >
          </md-card-actions>
        </md-card>
      </div>
    </div>
    <!-- dialog:close-billing -->
    <md-dialog-prompt
      :md-active.sync="dialogs.isCloseBillingVisible"
      v-model="privates.closableBilling.billingSaldo"
      md-title="Wollen Sie die aktuelle Abrechnung abschließen?"
      md-content="Bitte geben Sie den Abrechnungssaldo in Euro ein."
      md-input-placeholder="Abrechnungssaldo"
      md-confirm-text="Abschließen"
      md-cancel-text="Abbrechen"
      @md-confirm="onCloseBillingConfirm"
      @md-cancel="onCloseBillingCancel"
    />
    <!-- dialog:create -->
    <md-dialog :md-active.sync="dialogs.isCreateEntryVisible">
      <md-dialog-title>Einen neuen Abrechnungseintrag anlegen</md-dialog-title>
      <form novalidate @submit.prevent="createBillingEntry">
        <md-dialog-content>
          <md-field>
            <label for="billing">Abrechnung</label>
            <md-select
              v-model="form.billing"
              name="billing"
              id="billing"
              md-dense
            >
              <md-option
                v-for="interval in currentBillingIntervals"
                :value="interval.value"
                :key="interval.value"
              >
                {{ interval.text }}
              </md-option>
            </md-select>
          </md-field>
          <md-datepicker v-model.trim="form.date">
            <label>Datum</label>
          </md-datepicker>
          <md-checkbox v-model="form.hasBreakfast">Frühstück</md-checkbox>
          <md-checkbox v-model="form.hasLunch">Mittagessen</md-checkbox>
          <md-checkbox v-model="form.hasAfternoonSnack">Vespar</md-checkbox>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="closeDialog();"
            >Abbrechen</md-button
          >
          <md-button class="md-primary" type="submit">Speichern</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
    <!-- fab -->
    <div class="container-button">
      <md-button
        class="md-fab"
        @click="dialogs.isCreateEntryVisible = !dialogs.isCreateEntryVisible;"
      >
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { fb } from "../config/firebaseConfig.js";
import { ActionType, MutationType, StateProperty } from "../helper";

export default {
  name: "Dashboard",
  computed: {
    ...mapState([
      StateProperty.CURRENT_USER,
      StateProperty.CURRENT_SETTING,
      StateProperty.CURRENT_BILLINGS
    ]),
    currentBillingIntervals: function() {
      if (this.currentBillings) {
        return this.currentBillings.map(billing => {
          return {
            text: `${billing.month}.${billing.year}`,
            value: billing.id
          };
        });
      }
      return [{ text: "", value: "" }];
    }
  },
  data() {
    return {
      dialogs: {
        isCreateEntryVisible: false,
        isCloseBillingVisible: false
      },
      form: {
        billing: null,
        hasBreakfast: null,
        hasLunch: null,
        hasAfternoonSnack: null,
        date: null
      },
      privates: {
        closableBilling: {}
      }
    };
  },
  methods: {
    setBillingAsPaid(item) {
      this.privates.closableBilling = item;
      this.dialogs.isCloseBillingVisible = !this.dialogs.isCloseBillingVisible;
    },
    onCloseBillingConfirm() {
      fb.billings
        .doc(this.privates.closableBilling.id)
        .update({
          billingSaldo: parseFloat(this.privates.closableBilling.billingSaldo),
          isPaid: true
        })
        .then(() => {
          this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
          this.privates.closableBilling = {};
        })
        .catch(error =>
          this.$store.commit(MutationType.SET_CURRENT_ERROR, error)
        );
    },
    onCloseBillingCancel() {
      this.privates.closableBilling = {};
    },
    closeDialog() {
      this.form.billing = null;
      this.form.hasBreakfast = null;
      this.form.hasLunch = null;
      this.form.hasAfternoonSnack = null;
      this.form.date = null;
      this.dialogs.isCreateEntryVisible = !this.dialogs.isCreateEntryVisible;
    },
    createBillingEntry() {
      // 1. save entry
      fb.billingEntries
        .add({
          billingId: this.form.billing,
          date: this.form.date,
          hasAfternoonSnack: !!this.form.hasAfternoonSnack,
          hasBreakfast: !!this.form.hasBreakfast,
          hasLunch: !!this.form.hasLunch
        })
        .then(res => {
          // 2. get current billing saldo
          const billing = this.currentBillings.filter(
            billing => billing.id === this.form.billing
          );
          let newCurrentSaldo = billing[0].currentSaldo;
          // 3. add new values
          if (this.form.hasBreakfast) {
            newCurrentSaldo += this.currentSetting.breakfastPrize;
          }
          if (this.form.hasLunch) {
            newCurrentSaldo += this.currentSetting.lunchPrize;
          }
          if (this.form.hasAfternoonSnack) {
            newCurrentSaldo += this.currentSetting.afternoonSnackPrize;
          }
          // 4. update currentsaldo
          fb.billings
            .doc(this.form.billing)
            .update({
              currentSaldo: newCurrentSaldo
            })
            .then(() => {
              this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
              this.closeDialog();
            })
            .catch(error =>
              this.$store.commit(MutationType.SET_CURRENT_ERROR, error)
            );
        })
        .catch(error =>
          this.$store.commit(MutationType.SET_CURRENT_ERROR, error)
        );
    }
  }
};
</script>

<style>
.dashboard-container_height {
  height: inherit;
  margin-top: 12px;
}

.container-button {
  position: absolute;
  bottom: 12px;
  left: calc(50vw - 56px);
}

.card-margin_bottom {
  margin-bottom: 12px;
}

/* Smartphones (portrait and landscape) ----------- */
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .container-button {
    left: calc(50vw - 36px);
  }
}
</style>
