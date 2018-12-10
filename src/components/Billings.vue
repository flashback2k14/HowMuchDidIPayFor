<template>
  <div class="md-layout md-alignment-top-center billing-container_height">
    <!-- billings data table -->
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
            <md-table
              class="billing-table_height"
              :value="billings"
              md-fixed-header
              @md-selected="handleBillingSelection"
            >
              <md-table-row
                slot="md-table-row"
                slot-scope="{
                  item
                }"
                md-selectable="single"
              >
                <md-table-cell md-label="Position" md-numeric>{{
                  item.pos
                }}</md-table-cell>
                <md-table-cell md-label="Aktueller Betrag (€)" md-numeric>{{
                  item.currentSaldo
                }}</md-table-cell>
                <md-table-cell md-label="Rechnungsbetrag (€)" md-numeric>{{
                  item.billingSaldo
                }}</md-table-cell>
                <md-table-cell md-label="Abrechnungsmonat" md-numeric>{{
                  item.month
                }}</md-table-cell>
                <md-table-cell md-label="Abrechnungsjahr" md-numeric>{{
                  item.year
                }}</md-table-cell>
                <md-table-cell md-label="Bezahlt">
                  <md-checkbox v-model="item.isPaid" disabled></md-checkbox>
                </md-table-cell>
                <md-table-cell md-label="Löschen">
                  <md-button
                    class="md-icon-button md-dense"
                    @click="handleDeleteBillingDialog(item);"
                  >
                    <md-icon>delete</md-icon>
                  </md-button>
                </md-table-cell>
              </md-table-row>
            </md-table>
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
    <!-- billing entries data table -->
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
            <md-table
              class="entries-table_height"
              :value="billingEntries"
              md-fixed-header
            >
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Position" md-numeric>{{
                  item.pos
                }}</md-table-cell>
                <md-table-cell md-label="Tag">{{
                  item.date | formattedDate
                }}</md-table-cell>
                <md-table-cell md-label="Frühstück">
                  <md-checkbox
                    v-model="item.hasBreakfast"
                    disabled
                  ></md-checkbox>
                </md-table-cell>
                <md-table-cell md-label="Mittagessen">
                  <md-checkbox v-model="item.hasLunch" disabled></md-checkbox>
                </md-table-cell>
                <md-table-cell md-label="Vespar">
                  <md-checkbox
                    v-model="item.hasAfternoonSnack"
                    disabled
                  ></md-checkbox>
                </md-table-cell>
              </md-table-row>
            </md-table>
          </div>
        </md-card-content>
      </md-card>
    </div>
    <!-- dialog:create -->
    <md-dialog :md-active.sync="dialogs.isCreateVisible">
      <md-dialog-title>Erstellung einer neuen Monatsabrechnung</md-dialog-title>
      <form novalidate @submit.prevent="createBilling">
        <md-dialog-content>
          <md-field>
            <label>Abrechnungsmonat</label>
            <md-input
              type="number"
              name="month"
              id="month"
              v-model.trim="form.month"
              min="1"
              max="12"
              step="1"
            ></md-input>
          </md-field>
          <md-field>
            <label>Abrechnungsjahr</label>
            <md-input
              type="number"
              name="year"
              id="year"
              v-model.trim="form.year"
              min="1"
              max="12"
              step="1"
            ></md-input>
          </md-field>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="handleCloseCreateDialog"
            >Abbrechen</md-button
          >
          <md-button class="md-primary" type="submit">Speichern</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { ActionType, MutationType, StateProperty } from "@/helper";
import { creator, deletter, getter } from "@/database";

export default {
  name: "Billings",
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
        isDeleteVisible: false
      },
      form: {
        month: null,
        year: null
      },
      privates: {
        deletedableBilling: null
      }
    };
  },
  methods: {
    handleBillingSelection(item) {
      if (item) {
        this.$store.commit(MutationType.SET_CURRENT_SELECTED_BILLING, item);
        this.$store.dispatch(
          ActionType.FETCH_USER_BILLING_ENTRIES_FOR_SELECTION
        );
      } else {
        this.$store.commit(MutationType.SET_CURRENT_SELECTED_BILLING, null);
        this.$store.commit(MutationType.SET_CURRENT_BILLING_ENTRIES, []);
      }
    },
    handleCloseCreateDialog() {
      this.form.month = null;
      this.form.year = null;
      this.dialogs.isCreateVisible = !this.dialogs.isCreateVisible;
    },
    async createBilling() {
      try {
        await creator.billing(this[StateProperty.CURRENT_USER].uid, {
          month: parseInt(this.form.month, 10),
          year: parseInt(this.form.year, 10)
        });
        this.$store.commit(MutationType.SET_CURRENT_SELECTED_BILLING, null);
        this.$store.commit(MutationType.SET_CURRENT_BILLING_ENTRIES, []);
        this.$store.dispatch(ActionType.FETCH_USER_BILLINGS);
        this.handleCloseCreateDialog();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleDeleteBillingDialog(item) {
      this.privates.deletedableBilling = item;
      this.dialogs.isDeleteVisible = !this.dialogs.isDeleteVisible;
    },
    async handleConfirmDeleteBilling() {
      try {
        await deletter.billing(this.privates.deletedableBilling.id);
        const entries = await getter.billingEntries(
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
.billing-table_height {
  height: 40vh;
}
.entries-table_height {
  height: 50vh;
}
</style>
