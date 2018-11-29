<template>
  <div class="md-layout md-alignment-top-center setting-container_height">
    <!-- data table -->
    <div class="md-layout-item md-size-95">
      <md-table :value="userSettings" md-card>
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Position" md-numeric>{{
            item.pos
          }}</md-table-cell>
          <md-table-cell md-label="Preis für Frückstück (€)" md-numeric>{{
            item.breakfastPrize
          }}</md-table-cell>
          <md-table-cell md-label="Preis für Mittagessen (€)" md-numeric>{{
            item.lunchPrize
          }}</md-table-cell>
          <md-table-cell md-label="Preis für Vespar (€)" md-numeric>{{
            item.afternoonSnackPrize
          }}</md-table-cell>
          <md-table-cell md-label="Gültig Bis">{{
            item.expirationDate | formattedDate
          }}</md-table-cell>
          <md-table-cell md-label="Bearbeiten">
            <md-button
              class="md-icon-button md-dense"
              @click="showEditDialog(item);"
            >
              <md-icon>edit</md-icon>
            </md-button>
          </md-table-cell>
          <md-table-cell md-label="Löschen">
            <md-button
              class="md-icon-button md-dense"
              @click="showDeleteDialog(item);"
            >
              <md-icon>delete</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    <!-- dialog:create -->
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Eine neue Einstellung anlegen</md-dialog-title>
      <form novalidate @submit.prevent="createSetting">
        <md-dialog-content>
          <md-field>
            <label>Preis für Frühstück</label>
            <md-input
              type="number"
              name="breakfastPrize"
              id="breakfastPrize"
              v-model.trim="form.breakfastPrize"
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
              v-model.trim="form.lunchPrize"
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
              v-model.trim="form.afternoonSnackPrize"
              min="0.05"
              step="0.10"
            ></md-input>
            <span class="md-suffix">Euro</span>
          </md-field>
          <md-datepicker v-model.trim="form.expirationDate">
            <label>Gültig bis</label>
          </md-datepicker>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="closeDialog();"
            >Abbrechen</md-button
          >
          <md-button class="md-primary" type="submit">Speichern</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
    <!-- dialog:edit -->
    <md-dialog :md-active.sync="showDialogEdit">
      <md-dialog-title>Einstellung bearbeiten</md-dialog-title>
      <form novalidate @submit.prevent="editSetting">
        <md-dialog-content>
          <md-field>
            <label>Preis für Frühstück</label>
            <md-input
              type="number"
              name="breakfastPrize"
              id="breakfastPrize"
              v-model.trim="form.breakfastPrize"
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
              v-model.trim="form.lunchPrize"
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
              v-model.trim="form.afternoonSnackPrize"
              min="0.05"
              step="0.10"
            ></md-input>
            <span class="md-suffix">Euro</span>
          </md-field>
          <md-datepicker v-model.trim="form.expirationDate">
            <label>Gültig bis</label>
          </md-datepicker>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click="closeDialogEdit();"
            >Abbrechen</md-button
          >
          <md-button class="md-primary" type="submit">Aktualisieren</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
    <!-- dialog:delete -->
    <md-dialog-confirm
      :md-active.sync="showDialogDelete"
      md-title="Wollen Sie wirklich diesen Eintrag löschen?"
      md-confirm-text="Ja"
      md-cancel-text="Nein"
      @md-confirm="onDeleteConfirm"
      @md-cancel="onDeleteCancel"
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

const formatter = new Intl.DateTimeFormat("de-DE", {
  year: "numeric",
  month: "long",
  day: "numeric"
});

const formattedDateFilter = function(value) {
  return formatter.format(new Date(value.seconds * 1000));
};

export default {
  name: "Settings",
  data() {
    return {
      showDialog: false,
      showDialogEdit: false,
      showDialogDelete: false,
      editableSetting__: null,
      deletedableSetting__: null,
      form: {
        breakfastPrize: null,
        lunchPrize: null,
        afternoonSnackPrize: null,
        expirationDate: null
      }
    };
  },
  computed: {
    ...mapState(["userSettings", "currentUser"])
  },
  filters: {
    formattedDate: formattedDateFilter
  },
  methods: {
    clearForm() {
      this.form.breakfastPrize = null;
      this.form.lunchPrize = null;
      this.form.afternoonSnackPrize = null;
      this.form.expirationDate = null;
    },
    closeDialog() {
      this.clearForm();
      this.showDialog = !this.showDialog;
    },
    closeDialogEdit() {
      this.clearForm();
      this.showDialogEdit = !this.showDialogEdit;
    },
    createSetting() {
      fb.settings
        .add({
          breakfastPrize: parseFloat(this.form.breakfastPrize),
          lunchPrize: parseFloat(this.form.lunchPrize),
          afternoonSnackPrize: parseFloat(this.form.afternoonSnackPrize),
          expirationDate: this.form.expirationDate,
          userId: this.currentUser.uid
        })
        .then(res => {
          this.$store.dispatch("fetchUserSettings");
          this.closeDialog();
        })
        .catch(error => {
          console.log(error);
        });
    },
    editSetting() {
      fb.settings
        .doc(this.editableSetting__.id)
        .update({
          breakfastPrize: parseFloat(this.form.breakfastPrize),
          lunchPrize: parseFloat(this.form.lunchPrize),
          afternoonSnackPrize: parseFloat(this.form.afternoonSnackPrize),
          expirationDate: this.form.expirationDate
        })
        .then(() => {
          this.$store.dispatch("fetchUserSettings");
          this.editableSetting__ = null;
          this.closeDialogEdit();
        })
        .catch(error => {
          console.error(error);
        });
    },
    showEditDialog(item) {
      this.editableSetting__ = item;
      this.form.breakfastPrize = item.breakfastPrize;
      this.form.lunchPrize = item.lunchPrize;
      this.form.afternoonSnackPrize = item.afternoonSnackPrize;
      this.form.expirationDate = new Date(item.expirationDate.seconds * 1000);
      this.showDialogEdit = !this.showDialogEdit;
    },
    showDeleteDialog(item) {
      this.deletedableSetting__ = item;
      this.showDialogDelete = !this.showDialogDelete;
    },
    onDeleteConfirm() {
      fb.settings
        .doc(this.deletedableSetting__.id)
        .delete()
        .then(() => {
          this.$store.dispatch("fetchUserSettings");
          this.deletedableSetting__ = null;
        })
        .catch(error => {
          console.log(error);
        });
    },
    onDeleteCancel() {
      this.deletedableSetting__ = null;
    }
  }
};
</script>

<style>
.setting-container_height {
  height: inherit;
  margin-top: 12px;
}

.container-button {
  position: absolute;
  bottom: 12px;
  left: calc(50vw - 56px);
}
/* Smartphones (portrait and landscape) ----------- */
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
  .container-button {
    left: calc(50vw - 36px);
  }
}
</style>
