<template>
  <md-dialog :md-active.sync="isVisible">
    <md-dialog-title>Einen neuen Abrechnungseintrag anlegen</md-dialog-title>
    <form novalidate @submit.prevent="handleConfirm">
      <md-dialog-content>
        <md-field>
          <label for="billing">Abrechnung</label>
          <md-select
            v-model="form.billing"
            name="billing"
            id="billing"
            md-dense
          >
            <md-option
              v-for="interval in billingIntervals"
              :value="interval.value"
              :key="interval.value"
            >
              {{ interval.text }}
            </md-option>
          </md-select>
        </md-field>
        <md-datepicker v-model.trim="form.date">
          <label>Datum</label>
        </md-datepicker>
        <md-checkbox v-model="form.hasBreakfast">Frühstück</md-checkbox>
        <md-checkbox v-model="form.hasLunch">Mittagessen</md-checkbox>
        <md-checkbox v-model="form.hasAfternoonSnack">Vespar</md-checkbox>
        <md-field>
          <label>Anmerkung</label>
          <md-textarea v-model="form.comment"></md-textarea>
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
  name: "CreateBillingEntryDialog",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    billingIntervals: {
      type: Array
    }
  },
  data() {
    return {
      form: {
        billing: null,
        hasBreakfast: null,
        hasLunch: null,
        hasAfternoonSnack: null,
        date: null,
        comment: null
      }
    };
  },
  methods: {
    handleConfirm() {
      this.$emit("on-confirm", { data: this.form });
    },
    handleCancel() {
      this.form.billing = null;
      this.form.hasBreakfast = null;
      this.form.hasLunch = null;
      this.form.hasAfternoonSnack = null;
      this.form.date = null;
      this.form.comment = null;
      this.$emit("on-cancel");
    }
  }
};
</script>
