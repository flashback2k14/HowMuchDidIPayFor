<template>
  <md-table
    class="billing-table_height"
    :value="billings"
    md-fixed-header
    @md-selected="handleSelection"
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
        <md-button class="md-icon-button md-dense" @click="handleDelete(item);">
          <md-icon>delete</md-icon>
        </md-button>
      </md-table-cell>
    </md-table-row>
  </md-table>
</template>

<script>
export default {
  name: "BillingsTable",
  props: {
    billings: {
      type: Array
    }
  },
  methods: {
    handleSelection(billing) {
      this.$emit("on-billing-selection", { data: billing });
    },
    handleDelete(billing) {
      this.$emit("on-delete", { data: billing });
    }
  }
};
</script>

<style>
.billing-table_height {
  height: 40vh;
}
</style>
