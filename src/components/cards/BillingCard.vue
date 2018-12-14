<template>
  <md-card class="card-margin_bottom">
    <md-card-header>
      <div class="md-title">
        Abrechnung {{ billingItem.month }}.{{ billingItem.year }}
      </div>
      <md-divider></md-divider>
    </md-card-header>

    <md-card-content>
      <md-field>
        <label>Aktueller Betrag</label>
        <md-input
          :value="billingItem.currentSaldo | formattedDecimal"
          disabled
        ></md-input>
        <span class="md-suffix">Euro</span>
      </md-field>
    </md-card-content>

    <md-card-actions>
      <md-button @click="handleAction">Abrechnung abschließen</md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
export default {
  name: "BillingCard",
  props: {
    billingItem: {
      type: Object
    }
  },
  methods: {
    handleAction() {
      this.$emit("on-close-billing", { data: this.billingItem });
    }
  }
};
</script>
