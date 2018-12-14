<template>
  <md-dialog :md-active.sync="isVisible">
    <md-dialog-title
      >Wollen Sie die aktuelle Abrechnung abschließen?</md-dialog-title
    >
    <form novalidate @submit.prevent="handleConfirm">
      <md-dialog-content>
        <md-field>
          <label>Abrechnungssaldo</label>
          <md-input
            type="number"
            name="billingSaldo"
            id="billingSaldo"
            v-model.trim="form.billingSaldo"
            min="0.05"
            step="0.10"
          ></md-input>
          <span class="md-suffix">Euro</span>
        </md-field>
        <md-field>
          <label>Anmerkung</label>
          <md-textarea v-model="form.comment"></md-textarea>
        </md-field>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button class="md-primary" @click="handleCancel"
          >Abbrechen</md-button
        >
        <md-button class="md-primary" type="submit">Abschließen</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<script>
export default {
  name: "CloseBillingDialog",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        billingSaldo: null,
        comment: null
      }
    };
  },
  methods: {
    handleConfirm() {
      this.$emit("on-confirm", { data: this.form });
    },
    handleCancel() {
      this.form.billingSaldo = null;
      this.form.comment = null;
      this.$emit("on-cancel");
    }
  }
};
</script>
