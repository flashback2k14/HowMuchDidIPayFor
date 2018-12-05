<template>
  <div class="md-layout md-alignment-top-center setting-container_height">
    <!-- data table -->
    <div class="md-layout-item md-size-95">
      <md-card>
        <md-card-header>
          <div class="md-title">Preishistorie</div>
          <md-divider></md-divider>
        </md-card-header>

        <md-card-content>
          <div v-if="userSettings === null || userSettings.length === 0">
            <md-empty-state
              md-icon="block"
              md-label="Einstellungen"
              md-description="Keine Daten vorhanden."
            >
            </md-empty-state>
          </div>
          <div v-else>
            <md-table :value="userSettings">
              <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Position" md-numeric>{{
                  item.pos
                }}</md-table-cell>
                <md-table-cell md-label="Preis für Frückstück (€)" md-numeric>{{
                  item.breakfastPrize
                }}</md-table-cell>
                <md-table-cell
                  md-label="Preis für Mittagessen (€)"
                  md-numeric
                  >{{ item.lunchPrize }}</md-table-cell
                >
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
        </md-card-content>

        <md-card-actions>
          <md-button
            @click="dialogs.isCreateVisible = !dialogs.isCreateVisible;"
            >Neuen Eintrag anlegen</md-button
          >
        </md-card-actions>
      </md-card>
    </div>
    <!-- dialog:create -->
    <md-dialog :md-active.sync="dialogs.isCreateVisible">
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
    <md-dialog :md-active.sync="dialogs.isEditVisible">
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
      :md-active.sync="dialogs.isDeleteVisible"
      md-title="Wollen Sie wirklich diesen Eintrag löschen?"
      md-confirm-text="Ja"
      md-cancel-text="Nein"
      @md-confirm="onDeleteConfirm"
      @md-cancel="onDeleteCancel"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { fb } from "../config/firebaseConfig.js";
import { ActionType, StateProperty } from "../helper";

export default {
  name: "Settings",
  computed: {
    ...mapState([StateProperty.CURRENT_USER, StateProperty.USER_SETTINGS])
  },
  data() {
    return {
      dialogs: {
        isCreateVisible: false,
        isEditVisible: false,
        isDeleteVisible: false
      },
      form: {
        breakfastPrize: null,
        lunchPrize: null,
        afternoonSnackPrize: null,
        expirationDate: null
      },
      privates: {
        deletedableSetting: null,
        editableSetting: null
      }
    };
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
      this.dialogs.isCreateVisible = !this.dialogs.isCreateVisible;
    },
    closeDialogEdit() {
      this.clearForm();
      this.dialogs.isEditVisible = !this.dialogs.isEditVisible;
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
          this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
          this.closeDialog();
        })
        .catch(error => {
          console.log(error);
        });
    },
    editSetting() {
      fb.settings
        .doc(this.privates.editableSetting.id)
        .update({
          breakfastPrize: parseFloat(this.form.breakfastPrize),
          lunchPrize: parseFloat(this.form.lunchPrize),
          afternoonSnackPrize: parseFloat(this.form.afternoonSnackPrize),
          expirationDate: this.form.expirationDate
        })
        .then(() => {
          this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
          this.privates.editableSetting = null;
          this.closeDialogEdit();
        })
        .catch(error => {
          console.error(error);
        });
    },
    showEditDialog(item) {
      this.privates.editableSetting = item;
      this.form.breakfastPrize = item.breakfastPrize;
      this.form.lunchPrize = item.lunchPrize;
      this.form.afternoonSnackPrize = item.afternoonSnackPrize;
      this.form.expirationDate = new Date(item.expirationDate.seconds * 1000);
      this.dialogs.isEditVisible = !this.dialogs.isEditVisible;
    },
    showDeleteDialog(item) {
      this.privates.deletedableSetting = item;
      this.dialogs.isDeleteVisible = !this.dialogs.isDeleteVisible;
    },
    onDeleteConfirm() {
      fb.settings
        .doc(this.privates.deletedableSetting.id)
        .delete()
        .then(() => {
          this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
          this.privates.deletedableSetting = null;
        })
        .catch(error => {
          console.log(error);
        });
    },
    onDeleteCancel() {
      this.privates.deletedableSetting = null;
    }
  }
};
</script>

<style>
.setting-container_height {
  height: inherit;
  margin-top: 12px;
}
</style>
