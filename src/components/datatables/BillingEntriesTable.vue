<template>
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
        <md-checkbox v-model="item.hasBreakfast" disabled></md-checkbox>
      </md-table-cell>
      <md-table-cell md-label="Mittagessen">
        <md-checkbox v-model="item.hasLunch" disabled></md-checkbox>
      </md-table-cell>
      <md-table-cell md-label="Vespar">
        <md-checkbox v-model="item.hasAfternoonSnack" disabled></md-checkbox>
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
export default {
  name: "BillingEntriesTable",
  props: {
    billingEntries: {
      type: Array
    }
  }
};
</script>

<style>
.entries-table_height {
  height: 50vh;
}
</style>
