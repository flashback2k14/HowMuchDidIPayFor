<template>
  <md-table :value="settings">
    <md-table-row slot="md-table-row" slot-scope="{ item }">
      <md-table-cell md-label="Position" md-numeric>{{
        item.pos
      }}</md-table-cell>
      <md-table-cell md-label="Preis für Frückstück (€)" md-numeric>{{
        item.breakfastPrize | formattedDecimal
      }}</md-table-cell>
      <md-table-cell md-label="Preis für Mittagessen (€)" md-numeric>{{
        item.lunchPrize | formattedDecimal
      }}</md-table-cell>
      <md-table-cell md-label="Preis für Vespar (€)" md-numeric>{{
        item.afternoonSnackPrize | formattedDecimal
      }}</md-table-cell>
      <md-table-cell md-label="Gültig Bis">{{
        item.expirationDate | formattedDate
      }}</md-table-cell>
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
    </md-table-row>
  </md-table>
</template>

<script>
export default {
  name: "PriceHistoryTable",
  props: {
    settings: {
      type: Array
    }
  },
  methods: {
    handleEdit(setting) {
      this.$emit("on-edit-setting", { data: setting });
    },
    handleDelete(setting) {
      this.$emit("on-delete-setting", { data: setting });
    }
  }
};
</script>
