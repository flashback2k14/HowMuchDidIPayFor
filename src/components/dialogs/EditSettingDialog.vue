<template>
  <md-dialog
    :md-active.sync="isVisible"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
  >
    <md-dialog-title>Einstellung bearbeiten</md-dialog-title>
    <form novalidate @submit.prevent="handleConfirm">
      <md-dialog-content>
        <md-field>
          <label>Preis für Frühstück</label>
          <md-input
            type="number"
            name="breakfastPrize"
            id="breakfastPrize"
            v-model.trim="editableSetting.breakfastPrize"
            min="0.05"
            step="0.10"
          ></md-input>
          <span class="md-suffix">Euro</span>
        </md-field>
        <md-field>
          <label>Preis für Mittagessen</label>
          <md-input
            type="number"
            name="lunchPrize"
            id="lunchPrize"
            v-model.trim="editableSetting.lunchPrize"
            min="0.05"
            step="0.10"
          ></md-input>
          <span class="md-suffix">Euro</span>
        </md-field>
        <md-field>
          <label>Preis für Vesper</label>
          <md-input
            type="number"
            name="afternoonSnackPrize"
            id="afternoonSnackPrize"
            v-model.trim="editableSetting.afternoonSnackPrize"
            min="0.05"
            step="0.10"
          ></md-input>
          <span class="md-suffix">Euro</span>
        </md-field>
        <md-datepicker v-model="editableSetting.expirationDate">
          <label>Gültig bis</label>
        </md-datepicker>
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
  name: "EditSettingDialog",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    editableSetting: {
      type: Object
    }
  },
  methods: {
    handleConfirm() {
      this.$emit("on-confirm", { data: this.editableSetting });
    },
    handleCancel() {
      this.$emit("on-cancel");
    }
  }
};
</script>
