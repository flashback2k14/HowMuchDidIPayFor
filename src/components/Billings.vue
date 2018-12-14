<template>
  <div class="md-layout md-alignment-top-center billing-container_height">
    <!-- card:billings -->
    <div class="md-layout-item md-size-95">
      <md-card>
        <md-card-header>
          <div class="md-title">Abrechnungen</div>
          <md-divider></md-divider>
        </md-card-header>
        <md-card-content>
          <div v-if="showEmptyMessageBillings">
            <md-empty-state
              md-icon="block"
              md-label="Abrechnungen"
              md-description="Keine Daten vorhanden."
            >
            </md-empty-state>
          </div>
          <div v-else>
            <billings-table
              :billings="billings"
              @on-billing-selection="handleBillingSelection"
              @on-show-comment="handleShowComment"
              @on-delete="handleDeleteBillingDialog"
            />
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button
            @click="dialogs.isCreateVisible = !dialogs.isCreateVisible;"
            >Neuen Monat beginnen</md-button
          >
        </md-card-actions>
      </md-card>
    </div>
    <!-- card:billing entries -->
    <div class="md-layout-item md-size-95">
      <md-card>
        <md-card-header>
          <div class="md-title">Abrechnungseinträge</div>
          <md-divider></md-divider>
        </md-card-header>

        <md-card-content>
          <div v-if="showEmptyMessageBillingEntries">
            <md-empty-state
              md-icon="block"
              md-label="Einträge"
              md-description="Keine Daten vorhanden oder keine Abrechnung ausgewählt."
            >
            </md-empty-state>
          </div>
          <div v-else>
            <billing-entries-table
              :billingEntries="billingEntries"
              @on-show-comment="handleShowComment"
            />
          </div>
        </md-card-content>
      </md-card>
    </div>
    <create-billing-dialog
      :isVisible="dialogs.isCreateVisible"
      @on-confirm="createBilling"
      @on-cancel="handleCloseCreateDialog"
    />
    <!-- dialog:delete -->
    <md-dialog-confirm
      :md-active.sync="dialogs.isDeleteVisible"
      md-title="Wollen Sie wirklich diesen Eintrag löschen?"
      md-content="Hinweis: Diese Aktion löscht auch alle verbundenen Abrechnungseinträge."
      md-confirm-text="Ja"
      md-cancel-text="Nein"
      @md-confirm="handleConfirmDeleteBilling"
      @md-cancel="handleCancelDeleteBilling"
    />
    <!-- dialog:show comment -->
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

import BillingsTable from "./datatables/BillingsTable.vue";
import BillingEntriesTable from "./datatables/BillingEntriesTable.vue";
import CreateBillingDialog from "./dialogs/CreateBillingDialog.vue";

export default {
  name: "Billings",
  components: {
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
      form: {
        month: null,
        year: null
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
    async createBilling(e) {
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
