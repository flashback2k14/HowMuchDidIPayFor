<template>
  <md-dialog
    :md-active.sync="isVisible"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
  >
    <md-dialog-title>Abrechnungseintrag bearbeiten</md-dialog-title>
    <form novalidate @submit.prevent="handleConfirm">
      <md-dialog-content
        md-close-on-esc="false"
        md-click-outside-to-close="false"
      >
        <md-field>
          <label for="billing">Abrechnung</label>
          <md-select
            v-model="editableItem.billing"
            name="billing"
            id="billing"
            md-dense
          >
            <md-option
              v-for="interval in billingIntervals"
              :value="interval.value"
              :key="interval.value"
              >{{ interval.text }}</md-option
            >
          </md-select>
        </md-field>
        <md-datepicker
          v-model.trim="formattedDate"
          :md-disabled-dates="disabledDates"
          md-immediately
        >
          <label>Datum</label>
        </md-datepicker>
        <md-checkbox v-model="editableItem.hasBreakfast">Frühstück</md-checkbox>
        <md-checkbox v-model="editableItem.hasLunch">Mittagessen</md-checkbox>
        <md-checkbox v-model="editableItem.hasAfternoonSnack"
          >Vespar</md-checkbox
        >
        <md-field class="remove-bottom_margin">
          <label>Anmerkung</label>
          <md-textarea v-model="editableItem.comment"></md-textarea>
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
import { mapState } from "vuex";
import { StateProperty } from "./../../helper";

export default {
  name: "EditBillingEntryDialog",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    editableItem: {
      type: Object
    }
  },
  computed: {
    ...mapState([StateProperty.CURRENT_BILLING_INTERVALS]),
    billingIntervals: function() {
      return this[StateProperty.CURRENT_BILLING_INTERVALS];
    },
    formattedDate: {
      get: function() {
        return this.editableItem.date
          ? new Date(this.editableItem.date.seconds * 1000)
          : null;
      },
      set: function(newValue) {
        this.editableItem.date.seconds = Math.ceil(newValue.valueOf() / 1000);
      }
    }
  },
  data() {
    return {
      disabledDates: date => {
        const day = date.getDay();
        return day === 6 || day === 0;
      }
    };
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

<style>
.remove-bottom_margin {
  margin-bottom: 0;
}
</style>
