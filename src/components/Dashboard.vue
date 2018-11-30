<template>
  <div class="md-layout md-alignment-top-center dashboard-container_height">
    <div class="md-layout-item md-size-95">
      <div v-if="currentBillings.length === 0">
        <md-empty-state
          md-icon="block"
          md-label="Dashboard"
          md-description="There is currently no data avialable."
        >
        </md-empty-state>
      </div>
      <div v-else v-for="item in currentBillings" :key="item.id">
        <md-card class="card-margin_bottom">
          <md-card-header>
            <div class="md-title">
              Abrechnung {{ item.month }}.{{ item.year }}
            </div>
            <md-divider></md-divider>
          </md-card-header>

          <md-card-content>
            <md-field>
              <label>Aktueller Betrag</label>
              <md-input v-model="item.currentSaldo" disabled></md-input>
              <span class="md-suffix">Euro</span>
            </md-field>
          </md-card-content>

          <md-card-actions>
            <md-button @click="setBillingAsPaid(item);"
              >Abrechnung abschließen</md-button
            >
          </md-card-actions>
        </md-card>
      </div>
    </div>
    <!-- dialog:close-billing -->
    <md-dialog-prompt
      :md-active.sync="showDialogCloseBilling"
      v-model="closableBilling__.billingSaldo"
      md-title="Wollen Sie die aktuelle Abrechnung abschließen?"
      md-content="Bitte geben Sie den Abrechnungssaldo in Euro ein."
      md-input-placeholder="Abrechnungssaldo"
      md-confirm-text="Abschließen"
      md-cancel-text="Abbrechen"
      @md-confirm="onCloseBillingConfirm"
      @md-cancel="onCloseBillingCancel"
    />
    <!-- fab -->
    <div class="container-button">
      <md-button class="md-fab" @click="showDialog = !showDialog;">
        <md-icon>add</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { fb } from "../config/firebaseConfig.js";

export default {
  name: "Dashboard",
  data() {
    return {
      showDialog: false,
      showDialogCloseBilling: false,
      closableBilling__: {}
    };
  },
  computed: {
    ...mapState(["currentBillings", "currentUser"])
  },
  methods: {
    setBillingAsPaid(item) {
      this.closableBilling__ = item;
      this.showDialogCloseBilling = !this.showDialogCloseBilling;
    },
    onCloseBillingConfirm() {
      fb.billings
        .doc(this.closableBilling__.id)
        .update({
          billingSaldo: parseFloat(this.closableBilling__.billingSaldo),
          isPaid: true
        })
        .then(() => {
          this.$store.dispatch("fetchUserBillings");
          this.closableBilling__ = {};
        })
        .catch(error => {
          console.error(error);
        });
    },
    onCloseBillingCancel() {
      this.closableBilling__ = {};
    }
  }
};
</script>

<style>
.dashboard-container_height {
  height: inherit;
  margin-top: 12px;
}

.container-button {
  position: absolute;
  bottom: 12px;
  left: calc(50vw - 56px);
}

.card-margin_bottom {
  margin-bottom: 12px;
}

/* Smartphones (portrait and landscape) ----------- */
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .container-button {
    left: calc(50vw - 36px);
  }
}
</style>
