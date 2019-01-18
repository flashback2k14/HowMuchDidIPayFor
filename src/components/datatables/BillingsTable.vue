<template>
  <md-table
    class="billing-table_height"
    :value="billings"
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
        item.currentSaldo | formattedDecimal
      }}</md-table-cell>
      <md-table-cell md-label="Rechnungsbetrag (€)" md-numeric>{{
        item.billingSaldo | formattedDecimal
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
      <md-table-cell md-label="Anmerkung">
        <md-button
          class="md-icon-button md-dense"
          :disabled="!item.comment"
          @click="handleShowComment(item);"
        >
          <md-icon>mode_comment</md-icon>
        </md-button>
      </md-table-cell>
      <md-table-cell md-label="Bearbeiten">
        <md-button class="md-icon-button md-dense" @click="handleEdit(item);">
          <md-icon>edit</md-icon>
        </md-button>
      </md-table-cell>
      <md-table-cell md-label="Löschen">
        <md-button class="md-icon-button md-dense" @click="handleDelete(item);">
          <md-icon>delete</md-icon>
        </md-button>
      </md-table-cell>
      <md-table-cell md-label="Aktualisierung">
        <md-button
          class="md-icon-button md-dense"
          @click="handleRecalcCurrentSaldo(item);"
        >
          <md-icon>attach_money</md-icon>
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
    handleShowComment(billing) {
      this.$emit("on-show-comment", { data: billing });
    },
    handleEdit(billing) {
      this.$emit("on-edit", { data: billing });
    },
    handleDelete(billing) {
      this.$emit("on-delete", { data: billing });
    },
    handleRecalcCurrentSaldo(billing) {
      this.$emit("on-recalc-currentsaldo", { data: billing });
    }
  }
};
</script>

<style>
.billing-table_height {
  height: 42vh;
}
</style>
