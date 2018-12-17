<template>
  <md-dialog
    :md-active.sync="isVisible"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
  >
    <md-dialog-title>Monatsabrechnung bearbeiten</md-dialog-title>
    <form novalidate @submit.prevent="handleConfirm">
      <md-dialog-content>
        <md-field>
          <label>Abrechnungsmonat</label>
          <md-input
            type="number"
            name="month"
            id="month"
            v-model.trim="editableItem.month"
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
            v-model.trim="editableItem.year"
            min="1"
            max="12"
            step="1"
          ></md-input>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="handleCancel"
          >Abbrechen</md-button
        >
        <md-button class="md-primary" type="submit">Aktualisieren</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<script>
export default {
  name: "EditBillingDialog",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    editableItem: {
      type: Object
    }
  },
  methods: {
    handleConfirm() {
      this.$emit("on-confirm", { data: this.editableItem });
    },
    handleCancel() {
      this.$emit("on-cancel");
    }
  }
};
</script>
