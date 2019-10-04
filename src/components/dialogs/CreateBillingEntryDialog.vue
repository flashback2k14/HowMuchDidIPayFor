<template>
  <md-dialog
    :md-active.sync="isVisible"
    :md-close-on-esc="false"
    :md-click-outside-to-close="false"
  >
    <md-dialog-title>Einen neuen Abrechnungseintrag anlegen</md-dialog-title>
    <form novalidate @submit.prevent="handleConfirm">
      <md-dialog-content
        md-close-on-esc="false"
        md-click-outside-to-close="false"
      >
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
              >{{ interval.text }}</md-option
            >
          </md-select>
        </md-field>
        <md-datepicker
          v-model.trim="form.date"
          :md-disabled-dates="disabledDates.bind(this)"
          md-immediately
        >
          <label>Datum</label>
        </md-datepicker>
        <md-checkbox v-model="form.hasBreakfast">Frühstück</md-checkbox>
        <md-checkbox v-model="form.hasLunch">Mittagessen</md-checkbox>
        <md-checkbox v-model="form.hasAfternoonSnack">Vespar</md-checkbox>
        <md-field class="remove-bottom_margin">
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
import { mapState } from "vuex";
import { StateProperty } from "./../../helper";

export default {
  name: "CreateBillingEntryDialog",
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState([
      StateProperty.CURRENT_BILLING_INTERVALS,
      StateProperty.CURRENT_BILLING_COVERED_DAYS
    ]),
    billingIntervals: function() {
      return this[StateProperty.CURRENT_BILLING_INTERVALS];
    },
    coveredBillingDays: function() {
      return this[StateProperty.CURRENT_BILLING_COVERED_DAYS];
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
      },
      disabledDates: date => {
        const day = date.getDay();
        if (day === 6 || day === 0) {
          return true;
        }

        if (!this.form.billing || !this.coveredBillingDays) {
          return false;
        }

        const currentDate = date.getDate();
        const coveredDays = this.coveredBillingDays[this.form.billing];
        return coveredDays.indexOf(currentDate) !== -1;
      }
    };
  },
  methods: {
    handleConfirm() {
      this.$emit("on-confirm", { data: this.form });
      this._clearDialog();
    },
    handleCancel() {
      this._clearDialog();
      this.$emit("on-cancel");
    },
    _clearDialog() {
      this.form.billing = null;
      this.form.hasBreakfast = null;
      this.form.hasLunch = null;
      this.form.hasAfternoonSnack = null;
      this.form.date = null;
      this.form.comment = null;
    }
  }
};
</script>

<style>
.remove-bottom_margin {
  margin-bottom: 0;
}
</style>
