<template>
  <md-table class="entries-table_height" :value="billingEntries">
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
  },
  methods: {
    handleShowComment(entry) {
      this.$emit("on-show-comment", { data: entry });
    },
    handleEdit(entry) {
      this.$emit("on-edit", { data: entry });
    },
    handleDelete(entry) {
      this.$emit("on-delete", { data: entry });
    }
  }
};
</script>

<style>
.entries-table_height {
  height: 50vh;
}
</style>
