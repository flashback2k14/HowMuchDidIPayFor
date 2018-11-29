<template>
  <div class="md-layout md-alignment-top-center billing-container_height">
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
                <md-table-cell md-label="Aktueller Betrag" md-numeric>{{
                  item.currentSaldo
                }}</md-table-cell>
                <md-table-cell md-label="Rechnungsbetrag" md-numeric>{{
                  item.billingSaldo
                }}</md-table-cell>
                <md-table-cell md-label="Monat" md-numeric>{{
                  item.month
                }}</md-table-cell>
                <md-table-cell md-label="Jahr" md-numeric>{{
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
          <md-button>Neuen Monat beginnen</md-button>
        </md-card-actions>
      </md-card>
    </div>
    <md-divider></md-divider>
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
  </div>
</template>

<script>
import { mapState } from "vuex";

const formatter = new Intl.DateTimeFormat("de-DE", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

const formattedDateFilter = function(value) {
  return formatter.format(new Date(value.seconds * 1000));
};

export default {
  name: "Billings",
  computed: {
    ...mapState(["userBillings", "currentBillingEntries"])
  },
  filters: {
    formattedDate: formattedDateFilter
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
  height: 30vh;
}

.entries-table_height {
  height: 50vh;
}
</style>
