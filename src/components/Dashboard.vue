<template>
  <div class="md-layout md-alignment-top-center dashboard-container_height">
    <div class="md-layout-item md-size-95">
      <div v-if="showEmptyMessage">
        <md-empty-state
          md-icon="block"
          md-label="Übersicht"
          md-description="Keine Daten vorhanden."
        >
        </md-empty-state>
      </div>
      <div v-else v-for="billing in billings" :key="billing.id">
        <md-card class="card-margin_bottom">
          <md-card-header>
            <div class="md-title">
              Abrechnung {{ billing.month }}.{{ billing.year }}
            </div>
            <md-divider></md-divider>
          </md-card-header>

          <md-card-content>
            <md-field>
              <label>Aktueller Betrag</label>
              <md-input v-model="billing.currentSaldo" disabled></md-input>
              <span class="md-suffix">Euro</span>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button @click="handleSetBillingAsPaid(billing);"
              >Abrechnung abschließen</md-button
            >
          </md-card-actions>
        </md-card>
      </div>
    </div>
    <close-billing-dialog
      :isVisible.sync="dialogs.isCloseBillingVisible"
      :onCancel="handleCancelCloseBilling"
      :onConfirm="handleConfirmCloseBilling"
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
          <md-field>
            <label>Anmerkung</label>
            <md-textarea v-model="form.comment"></md-textarea>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="handleCloseCreateEntryDialog"
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
import { ActionType, MutationType, StateProperty } from "@/helper";
import { creator, updater } from "@/database";
import CloseBillingDialog from "./dialogs/CloseBillingDialog.vue";

export default {
  name: "Dashboard",
  components: {
    "close-billing-dialog": CloseBillingDialog
  },
  computed: {
    ...mapState([
      StateProperty.CURRENT_SETTING,
      StateProperty.CURRENT_BILLINGS
    ]),
    showEmptyMessage: function() {
      return (
        this[StateProperty.CURRENT_BILLINGS] === null ||
        this[StateProperty.CURRENT_BILLINGS].length === 0
      );
    },
    billings: function() {
      return this[StateProperty.CURRENT_BILLINGS];
    },
    currentBillingIntervals: function() {
      if (this[StateProperty.CURRENT_BILLINGS]) {
        return this[StateProperty.CURRENT_BILLINGS].map(billing => {
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
        date: null,
        comment: null
      },
      privates: {
        closableBilling: {}
      }
    };
  },
  methods: {
    handleSetBillingAsPaid(item) {
      this.privates.closableBilling = item;
      this.dialogs.isCloseBillingVisible = !this.dialogs.isCloseBillingVisible;
    },
    async handleConfirmCloseBilling(e) {
      try {
        await updater.billing.billingSaldo(this.privates.closableBilling.id, {
          billingSaldo: parseFloat(e.billingSaldo),
          comment: e.comment
        });
        this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
        this.privates.closableBilling = {};
        this.dialogs.isCloseBillingVisible = !this.dialogs
          .isCloseBillingVisible;
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCancelCloseBilling() {
      this.privates.closableBilling = {};
      this.dialogs.isCloseBillingVisible = !this.dialogs.isCloseBillingVisible;
    },
    handleCloseCreateEntryDialog() {
      this.form.billing = null;
      this.form.hasBreakfast = null;
      this.form.hasLunch = null;
      this.form.hasAfternoonSnack = null;
      this.form.date = null;
      this.form.comment = null;
      this.dialogs.isCreateEntryVisible = !this.dialogs.isCreateEntryVisible;
    },
    _calcNewCurrentSaldo() {
      const billing = this[StateProperty.CURRENT_BILLINGS].filter(
        billing => billing.id === this.form.billing
      );

      let saldo = billing[0].currentSaldo;

      if (this.form.hasBreakfast) {
        saldo += this[StateProperty.CURRENT_SETTING].breakfastPrize;
      }
      if (this.form.hasLunch) {
        saldo += this[StateProperty.CURRENT_SETTING].lunchPrize;
      }
      if (this.form.hasAfternoonSnack) {
        saldo += this[StateProperty.CURRENT_SETTING].afternoonSnackPrize;
      }
      return saldo;
    },
    async createBillingEntry() {
      try {
        await creator.billingEntry(this.form);
        const newCurrentSaldo = this._calcNewCurrentSaldo();
        await updater.billing.currentSaldo(this.form.billing, newCurrentSaldo);
        this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
        this.handleCloseCreateEntryDialog();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
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
