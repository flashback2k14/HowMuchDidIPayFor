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
          <div v-if="userBillings.length === 0">
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
              :value="userBillings"
              md-fixed-header
              @md-selected="onBillingSelect"
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
              </md-table-row>
            </md-table>
          </div>
        </md-card-content>
        <md-card-actions>
          <md-button @click="showDialog = !showDialog;"
            >Neuen Monat beginnen</md-button
          >
        </md-card-actions>
      </md-card>
    </div>
    <!-- billing entries data table -->
    <div class="md-layout-item md-size-95">
      <md-card>
        <md-card-header>
          <div class="md-title">Einträge</div>
          <md-divider></md-divider>
        </md-card-header>

        <md-card-content>
          <div v-if="currentBillingEntries.length === 0">
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
              :value="currentBillingEntries"
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
    <md-dialog :md-active.sync="showDialog">
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
          <md-button class="md-primary" @click="closeDialog();"
            >Abbrechen</md-button
          >
          <md-button class="md-primary" type="submit">Speichern</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { fb } from "../config/firebaseConfig.js";

export default {
  name: "Billings",
  data() {
    return {
      showDialog: false,
      form: {
        month: null,
        year: null
      }
    };
  },
  computed: {
    ...mapState(["currentUser", "userBillings", "currentBillingEntries"])
  },
  methods: {
    onBillingSelect(item) {
      if (item) {
        console.log(item);
        this.$store.commit("setCurrentSelectedBilling", item);
        this.$store.dispatch("fetchcurrentBillingEntries");
      } else {
        this.$store.commit("setCurrentSelectedBilling", null);
        this.$store.commit("setCurrentBillingEntries", []);
      }
    },
    closeDialog() {
      this.form.month = null;
      this.form.year = null;
      this.showDialog = !this.showDialog;
    },
    createBilling() {
      fb.billings
        .add({
          billingSaldo: 0,
          currentSaldo: 0,
          isPaid: false,
          userId: this.currentUser.uid,
          month: parseInt(this.form.month),
          year: parseInt(this.form.year)
        })
        .then(res => {
          this.$store.commit("setCurrentSelectedBilling", null);
          this.$store.commit("setCurrentBillingEntries", []);
          this.$store.dispatch("fetchUserBillings");
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
