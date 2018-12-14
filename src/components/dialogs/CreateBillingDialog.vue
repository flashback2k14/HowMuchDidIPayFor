<template>
  <md-dialog
    :md-active.sync="isVisible"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
  >
    <md-dialog-title>Erstellung einer neuen Monatsabrechnung</md-dialog-title>
    <form novalidate @submit.prevent="handleConfirm">
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
        <md-button class="md-primary" @click="handleCancel"
          >Abbrechen</md-button
        >
        <md-button class="md-primary" type="submit">Speichern</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<script>
export default {
  name: "CreateBillingDialog",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        month: null,
        year: null
      }
    };
  },
  methods: {
    handleConfirm() {
      this.$emit("on-confirm", { data: this.form });
    },
    handleCancel() {
      this.form.month = null;
      this.form.year = null;
      this.$emit("on-cancel");
    }
  }
};
</script>
