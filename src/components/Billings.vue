<template>
  <div class="md-layout md-alignment-top-center billing-container_height">
    <base-card
      class="md-layout-item md-size-95"
      title="Abrechnung"
      :showErrorMessage="showEmptyMessageBillings"
    >
      <template slot="else-part">
        <billings-table
          :billings="billings"
          @on-billing-selection="handleBillingSelection"
          @on-show-comment="handleShowCommentDialog"
          @on-edit="handleShowEditDialog"
          @on-delete="handleShowDeleteDialog"
          @on-recalc-currentsaldo="handleRecalcCurrentsaldo"
        />
      </template>
      <template slot="action-part">
        <md-card-actions>
          <md-button @click="handleShowCreateDialog"
            >Neuen Monat beginnen</md-button
          >
        </md-card-actions>
      </template>
    </base-card>

    <base-card
      class="md-layout-item md-size-95"
      title="Abrechnungseinträge"
      description="Keine Daten vorhanden oder keine Abrechnung ausgewählt."
      :showEmptyMessage="showEmptyMessageBillingEntries"
    >
      <template slot="else-part">
        <billing-entries-table
          :billingEntries="billingEntries"
          @on-show-comment="handleShowCommentDialog"
          @on-edit="handleShowEntryEditDialog"
          @on-delete="handleShowEntryDeleteDialog"
        />
      </template>
    </base-card>

    <md-dialog-alert
      :md-active.sync="dialog.isCommentVisible"
      :md-content="privates.showableComment"
      md-title="Anmerkung"
      md-confirm-text="Schließen"
    />

    <edit-billing-dialog
      :isVisible="dialog.billing.isEditVisible"
      :editableItem="privates.billing.editableItem"
      @on-confirm="handleConfirmEditBilling"
      @on-cancel="handleCancelEditBilling"
    />

    <edit-entry-dialog
      :isVisible="dialog.entry.isEditVisible"
      :editableItem="privates.entry.editableItem"
      @on-confirm="handleConfirmEditEntry"
      @on-cancel="handleCancelEditEntry"
    />

    <md-dialog-confirm
      :md-active.sync="dialog.billing.isDeleteVisible"
      md-title="Wollen Sie wirklich diesen Eintrag löschen?"
      md-content="Hinweis: Diese Aktion löscht auch alle verbundenen Abrechnungseinträge."
      md-confirm-text="Ja"
      md-cancel-text="Nein"
      @md-confirm="handleConfirmDeleteBilling"
      @md-cancel="handleCancelDeleteBilling"
    />

    <md-dialog-confirm
      :md-active.sync="dialog.entry.isDeleteVisible"
      md-title="Wollen Sie wirklich diesen Eintrag löschen?"
      md-content="Hinweis: Danach muss der Preis manuell aktualisiert werden."
      md-confirm-text="Ja"
      md-cancel-text="Nein"
      @md-confirm="handleConfirmDeleteEntry"
      @md-cancel="handleCancelDeleteEntry"
    />

    <create-billing-dialog
      :isVisible="dialog.billing.isCreateVisible"
      @on-confirm="handleConfirmCreateBilling"
      @on-cancel="handleCancelCreateBilling"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import { ActionType, MutationType, StateProperty } from "@/helper";
import { creator, reader, updater, deletter } from "@/database";

import BaseCard from "./cards/BaseCard.vue";
import BillingsTable from "./datatables/BillingsTable.vue";
import BillingEntriesTable from "./datatables/BillingEntriesTable.vue";
import CreateBillingDialog from "./dialogs/CreateBillingDialog.vue";
import EditBillingDialog from "./dialogs/EditBillingDialog.vue";
import EditBillingEntryDialog from "./dialogs/EditBillingEntryDialog.vue";

export default {
  name: "Billings",
  components: {
    "base-card": BaseCard,
    "billings-table": BillingsTable,
    "billing-entries-table": BillingEntriesTable,
    "create-billing-dialog": CreateBillingDialog,
    "edit-billing-dialog": EditBillingDialog,
    "edit-entry-dialog": EditBillingEntryDialog
  },
  computed: {
    ...mapState([
      StateProperty.CURRENT_USER,
      StateProperty.CURRENT_SETTING,
      StateProperty.CURRENT_BILLING_ENTRIES,
      StateProperty.CURRENT_BILLING_INTERVALS,
      StateProperty.USER_BILLINGS
    ]),
    showEmptyMessageBillings: function() {
      return (
        this[StateProperty.USER_BILLINGS] === null ||
        this[StateProperty.USER_BILLINGS].length === 0
      );
    },
    showEmptyMessageBillingEntries: function() {
      return (
        this[StateProperty.CURRENT_BILLING_ENTRIES] === null ||
        this[StateProperty.CURRENT_BILLING_ENTRIES].length === 0
      );
    },
    billings: function() {
      return this[StateProperty.USER_BILLINGS];
    },
    billingEntries: function() {
      return this[StateProperty.CURRENT_BILLING_ENTRIES];
    }
  },
  data() {
    return {
      dialog: {
        isCommentVisible: false,
        billing: {
          isEditVisible: false,
          isDeleteVisible: false,
          isCreateVisible: false
        },
        entry: {
          isEditVisible: false,
          isDeleteVisible: false
        }
      },
      privates: {
        showableComment: "",
        billing: {
          editableItem: {},
          deleteableItem: null
        },
        entry: {
          editableItem: {},
          deleteableItem: null
        }
      }
    };
  },
  methods: {
    // table events
    handleBillingSelection(e) {
      const billing = e.data;
      if (billing) {
        this.$store.commit(MutationType.SET_CURRENT_SELECTED_BILLING, billing);
        this.$store.dispatch(
          ActionType.FETCH_USER_BILLING_ENTRIES_FOR_SELECTION
        );
      } else {
        this.$store.commit(MutationType.SET_CURRENT_SELECTED_BILLING, null);
        this.$store.commit(MutationType.SET_CURRENT_BILLING_ENTRIES, []);
      }
    },
    // showing
    handleShowCommentDialog(e) {
      this.privates.showableComment = e.data.comment;
      this.dialog.isCommentVisible = !this.dialog.isCommentVisible;
    },
    // editing
    handleShowEditDialog(e) {
      this.privates.billing.editableItem = e.data;
      this.dialog.billing.isEditVisible = !this.dialog.billing.isEditVisible;
    },
    handleShowEntryEditDialog(e) {
      this.privates.entry.editableItem = e.data;
      this.dialog.entry.isEditVisible = !this.dialog.entry.isEditVisible;
    },
    async handleConfirmEditBilling(e) {
      try {
        await updater.billing.period(
          this.privates.billing.editableItem.id,
          e.data
        );
        this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
        this.handleCancelEditBilling();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    async handleConfirmEditEntry(e) {
      try {
        await updater.billingEntry(this.privates.entry.editableItem.id, e.data);
        this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
        this.handleCancelEditEntry();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCancelEditBilling() {
      this.privates.billing.editableItem = {};
      this.dialog.billing.isEditVisible = !this.dialog.billing.isEditVisible;
    },
    handleCancelEditEntry() {
      this.privates.entry.editableItem = {};
      this.dialog.entry.isEditVisible = !this.dialog.entry.isEditVisible;
    },
    // deleting
    handleShowDeleteDialog(e) {
      this.privates.billing.deleteableItem = e.data;
      this.dialog.billing.isDeleteVisible = !this.dialog.billing
        .isDeleteVisible;
    },
    handleShowEntryDeleteDialog(e) {
      this.privates.entry.deleteableItem = e.data;
      this.dialog.entry.isDeleteVisible = !this.dialog.entry.isDeleteVisible;
    },
    async handleConfirmDeleteBilling() {
      try {
        await deletter.billing(this.privates.billing.deleteableItem.id);
        const entries = await reader.billingEntries(
          this.privates.billing.deleteableItem.id
        );

        if (!entries.empty) {
          const promHolder = entries.docs.map(deletter.billingEntry);
          await Promise.all(promHolder);
        }
        this._updateStore();
        this.handleCancelDeleteBilling();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    async handleConfirmDeleteEntry() {
      try {
        await deletter.billingEntry(this.privates.entry.deleteableItem);
        this.$store.dispatch(
          ActionType.FETCH_USER_BILLING_ENTRIES_FOR_SELECTION
        );
        this.handleCancelDeleteEntry();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCancelDeleteBilling() {
      this.privates.billing.deleteableItem = null;
    },
    handleCancelDeleteEntry() {
      this.privates.entry.deleteableItem = null;
    },
    // creation
    handleShowCreateDialog() {
      this.dialog.billing.isCreateVisible = !this.dialog.billing
        .isCreateVisible;
    },
    async handleConfirmCreateBilling(e) {
      try {
        await creator.billing(this[StateProperty.CURRENT_USER].uid, {
          month: parseInt(e.data.month, 10),
          year: parseInt(e.data.year, 10)
        });
        this._updateStore();
        this.handleCancelCreateBilling();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCancelCreateBilling() {
      this.dialog.billing.isCreateVisible = !this.dialog.billing
        .isCreateVisible;
    },
    // recalc
    async handleRecalcCurrentsaldo(e) {
      const billingEntries = this[StateProperty.CURRENT_BILLING_ENTRIES];

      if (billingEntries.length <= 0) {
        return;
      }

      const currentSetting = this[StateProperty.CURRENT_SETTING];

      let currentSaldo = 0;

      billingEntries.forEach(entry => {
        if (entry.hasBreakfast) {
          currentSaldo += currentSetting.breakfastPrize;
        }
        if (entry.hasLunch) {
          currentSaldo += currentSetting.lunchPrize;
        }
        if (entry.hasAfternoonSnack) {
          currentSaldo += currentSetting.afternoonSnackPrize;
        }
      });

      try {
        await updater.billing.currentSaldo(e.data.id, currentSaldo);
        this._updateStore();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    // util
    _updateStore() {
      this.$store.commit(MutationType.SET_CURRENT_SELECTED_BILLING, null);
      this.$store.commit(MutationType.SET_CURRENT_BILLING_ENTRIES, []);
      this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
    }
  }
};
</script>

<style>
.billing-container_height {
  height: inherit;
  margin-top: 12px;
}
</style>
