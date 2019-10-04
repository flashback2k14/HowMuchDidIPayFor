<template>
  <div class="md-layout md-alignment-top-center dashboard-container_height">
    <div class="md-layout-item md-size-95">
      <div v-if="showEmptyMessage">
        <md-empty-state
          md-icon="block"
          md-label="Übersicht"
          md-description="Keine Daten vorhanden."
        ></md-empty-state>
      </div>
      <div v-else v-for="billing in billings" :key="billing.id">
        <billing-card
          :billingItem="billing"
          @on-close-billing="handleSetBillingAsPaid"
        />
      </div>
    </div>

    <close-billing-dialog
      :isVisible.sync="dialogs.isCloseBillingVisible"
      @on-cancel="handleCancelCloseBilling"
      @on-confirm="handleConfirmCloseBilling"
    />

    <create-billing-entry-dialog
      :isVisible="dialogs.isCreateEntryVisible"
      @on-cancel="handleCloseCreateEntryDialog"
      @on-confirm="handleCreateBillingEntry"
    />

    <div class="container-fab">
      <md-button
        class="md-fab"
        @click="dialogs.isCreateEntryVisible = !dialogs.isCreateEntryVisible"
      >
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import { ActionType, MutationType, StateProperty } from "./../helper";
import { creator, updater } from "./../database";

import BillingCard from "./cards/BillingCard.vue";
import CloseBillingDialog from "./dialogs/CloseBillingDialog.vue";
import CreateBillingEntryDialog from "./dialogs/CreateBillingEntryDialog.vue";

export default {
  name: "Dashboard",
  components: {
    "billing-card": BillingCard,
    "close-billing-dialog": CloseBillingDialog,
    "create-billing-entry-dialog": CreateBillingEntryDialog
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
    }
  },
  data() {
    return {
      dialogs: {
        isCreateEntryVisible: false,
        isCloseBillingVisible: false
      },
      privates: {
        closableBilling: {}
      }
    };
  },
  methods: {
    handleSetBillingAsPaid(e) {
      this.privates.closableBilling = e.data;
      this.dialogs.isCloseBillingVisible = !this.dialogs.isCloseBillingVisible;
    },
    async handleConfirmCloseBilling(e) {
      try {
        await updater.billing.billingSaldo(this.privates.closableBilling.id, {
          billingSaldo: parseFloat(e.data.billingSaldo),
          comment: e.data.comment
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
      this.dialogs.isCreateEntryVisible = !this.dialogs.isCreateEntryVisible;
    },
    _calcNewCurrentSaldo(formData) {
      const billings = this[StateProperty.CURRENT_BILLINGS].filter(
        billing => billing.id === formData.billing
      );

      let saldo = billings[0].currentSaldo;

      if (formData.hasBreakfast) {
        saldo += this[StateProperty.CURRENT_SETTING].breakfastPrize;
      }
      if (formData.hasLunch) {
        saldo += this[StateProperty.CURRENT_SETTING].lunchPrize;
      }
      if (formData.hasAfternoonSnack) {
        saldo += this[StateProperty.CURRENT_SETTING].afternoonSnackPrize;
      }
      return saldo;
    },
    _getCoveredDays(billingId) {
      const billings = this[StateProperty.CURRENT_BILLINGS].filter(
        billing => billing.id === billingId
      );
      return billings[0].coveredDays || [];
    },
    async handleCreateBillingEntry(e) {
      try {
        const formData = { ...e.data };
        await creator.billingEntry(formData);
        const newCurrentSaldo = this._calcNewCurrentSaldo(formData);
        await updater.billing.currentSaldo(formData.billing, newCurrentSaldo);
        await updater.billing.coveredDay(
          formData.billing,
          this._getCoveredDays(formData.billing),
          formData.date
        );
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

.container-fab {
  position: absolute;
  bottom: 12px;
  left: calc(50vw - 56px);
}

.card-margin_bottom {
  margin-bottom: 12px;
}

/* Smartphones (portrait and landscape) ----------- */
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .container-fab {
    left: calc(50vw - 36px);
  }
}
</style>
