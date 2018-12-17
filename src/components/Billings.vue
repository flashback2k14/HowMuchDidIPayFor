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
          @on-show-comment="handleShowComment"
          @on-delete="handleDeleteBillingDialog"
        />
      </template>
      <template slot="action-part">
        <md-card-actions>
          <md-button
            @click="dialogs.isCreateVisible = !dialogs.isCreateVisible;"
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
          @on-show-comment="handleShowComment"
        />
      </template>
    </base-card>

    <create-billing-dialog
      :isVisible="dialogs.isCreateVisible"
      @on-confirm="handleCreateBilling"
      @on-cancel="handleCloseCreateDialog"
    />

    <md-dialog-confirm
      :md-active.sync="dialogs.isDeleteVisible"
      md-title="Wollen Sie wirklich diesen Eintrag löschen?"
      md-content="Hinweis: Diese Aktion löscht auch alle verbundenen Abrechnungseinträge."
      md-confirm-text="Ja"
      md-cancel-text="Nein"
      @md-confirm="handleConfirmDeleteBilling"
      @md-cancel="handleCancelDeleteBilling"
    />

    <md-dialog-alert
      :md-active.sync="dialogs.isShowCommentVisible"
      :md-content="privates.showableComment"
      md-confirm-text="OK"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import { ActionType, MutationType, StateProperty } from "@/helper";
import { creator, deletter, reader } from "@/database";

import BaseCard from "./cards/BaseCard.vue";
import BillingsTable from "./datatables/BillingsTable.vue";
import BillingEntriesTable from "./datatables/BillingEntriesTable.vue";
import CreateBillingDialog from "./dialogs/CreateBillingDialog.vue";

export default {
  name: "Billings",
  components: {
    "base-card": BaseCard,
    "billings-table": BillingsTable,
    "billing-entries-table": BillingEntriesTable,
    "create-billing-dialog": CreateBillingDialog
  },
  computed: {
    ...mapState([
      StateProperty.CURRENT_USER,
      StateProperty.CURRENT_BILLING_ENTRIES,
      StateProperty.USER_BILLINGS
    ]),
    showEmptyMessageBillings: function() {
      return (
        this[StateProperty.USER_BILLINGS] === null ||
        this[StateProperty.USER_BILLINGS].length === 0
      );
    },
    billings: function() {
      return this[StateProperty.USER_BILLINGS];
    },
    showEmptyMessageBillingEntries: function() {
      return (
        this[StateProperty.CURRENT_BILLING_ENTRIES] === null ||
        this[StateProperty.CURRENT_BILLING_ENTRIES].length === 0
      );
    },
    billingEntries: function() {
      return this[StateProperty.CURRENT_BILLING_ENTRIES];
    }
  },
  data() {
    return {
      dialogs: {
        isCreateVisible: false,
        isDeleteVisible: false,
        isShowCommentVisible: false
      },
      privates: {
        deletedableBilling: null,
        showableComment: ""
      }
    };
  },
  methods: {
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
    handleCloseCreateDialog() {
      this.dialogs.isCreateVisible = !this.dialogs.isCreateVisible;
    },
    async handleCreateBilling(e) {
      try {
        await creator.billing(this[StateProperty.CURRENT_USER].uid, {
          month: parseInt(e.data.month, 10),
          year: parseInt(e.data.year, 10)
        });

        this.$store.commit(MutationType.SET_CURRENT_SELECTED_BILLING, null);
        this.$store.commit(MutationType.SET_CURRENT_BILLING_ENTRIES, []);
        this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);

        this.handleCloseCreateDialog();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleShowComment(e) {
      this.privates.showableComment = e.data.comment;
      this.dialogs.isShowCommentVisible = !this.dialogs.isShowCommentVisible;
    },
    handleDeleteBillingDialog(e) {
      this.privates.deletedableBilling = e.data;
      this.dialogs.isDeleteVisible = !this.dialogs.isDeleteVisible;
    },
    async handleConfirmDeleteBilling() {
      try {
        await deletter.billing(this.privates.deletedableBilling.id);
        const entries = await reader.billingEntries(
          this.privates.deletedableBilling.id
        );

        if (!entries.empty) {
          const promHolder = entries.docs.map(deletter.billingEntry);
          await Promise.all(promHolder);
        }

        this.$store.commit(MutationType.SET_CURRENT_SELECTED_BILLING, null);
        this.$store.commit(MutationType.SET_CURRENT_BILLING_ENTRIES, []);
        this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);

        this.privates.deletedableBilling = null;
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCancelDeleteBilling() {
      this.privates.deletedableBilling = null;
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
