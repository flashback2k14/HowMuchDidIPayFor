<template>
  <div class="md-layout md-alignment-top-center setting-container_height">
    <!-- card:prize history -->
    <div class="md-layout-item md-size-95">
      <md-card>
        <md-card-header>
          <div class="md-title">Preishistorie</div>
          <md-divider></md-divider>
        </md-card-header>

        <md-card-content>
          <div v-if="showErrorMessage">
            <md-empty-state
              md-icon="block"
              md-label="Einstellungen"
              md-description="Keine Daten vorhanden."
            >
            </md-empty-state>
          </div>
          <div v-else>
            <price-history-table
              :settings="settings"
              @on-edit-setting="handleShowEditDialog"
              @on-delete-setting="handleShowDeleteDialog"
            />
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
    <create-setting-dialog
      :isVisible="dialogs.isCreateVisible"
      @on-confirm="createSetting"
      @on-cancel="handleCloseCreateDialog"
    />
    <edit-setting-dialog
      :isVisible="dialogs.isEditVisible"
      :editableSetting="privates.editableSetting"
      @on-confirm="editSetting"
      @on-cancel="handleCloseEditDialog"
    />
    <!-- dialog:delete setting -->
    <md-dialog-confirm
      :md-active.sync="dialogs.isDeleteVisible"
      md-title="Wollen Sie wirklich diesen Eintrag löschen?"
      md-confirm-text="Ja"
      md-cancel-text="Nein"
      @md-confirm="handleConfirmDeleteSetting"
      @md-cancel="handleCancelDeleteSetting"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import { ActionType, MutationType, StateProperty } from "@/helper";
import { creator, updater, deletter } from "@/database";

import PriceHistoryTable from "./datatables/PriceHistoryTable.vue";
import CreateSettingDialog from "./dialogs/CreateSettingDialog.vue";
import EditSettingDialog from "./dialogs/EditSettingDialog.vue";

export default {
  name: "Settings",
  components: {
    "price-history-table": PriceHistoryTable,
    "create-setting-dialog": CreateSettingDialog,
    "edit-setting-dialog": EditSettingDialog
  },
  computed: {
    ...mapState([StateProperty.CURRENT_USER, StateProperty.USER_SETTINGS]),
    showErrorMessage: function() {
      return (
        this[StateProperty.USER_SETTINGS] === null ||
        this[StateProperty.USER_SETTINGS].length === 0
      );
    },
    settings: function() {
      return this[StateProperty.USER_SETTINGS];
    }
  },
  data() {
    return {
      dialogs: {
        isCreateVisible: false,
        isEditVisible: false,
        isDeleteVisible: false
      },
      privates: {
        deletedableSetting: null,
        editableSetting: {}
      }
    };
  },
  methods: {
    handleCloseCreateDialog() {
      this.dialogs.isCreateVisible = !this.dialogs.isCreateVisible;
    },
    async createSetting(e) {
      try {
        await creator.setting(this[StateProperty.CURRENT_USER].uid, e.data);
        this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
        this.handleCloseCreateDialog();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCloseEditDialog() {
      this.dialogs.isEditVisible = !this.dialogs.isEditVisible;
    },
    handleShowEditDialog(e) {
      let setting = e.data;
      setting.expirationDate = new Date(setting.expirationDate.seconds * 1000);
      this.privates.editableSetting = setting;
      this.handleCloseEditDialog();
    },
    async editSetting(e) {
      try {
        await updater.setting(this.privates.editableSetting.id, e.data);
        this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
        this.privates.editableSetting = {};
        this.handleCloseEditDialog();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleShowDeleteDialog(e) {
      this.privates.deletedableSetting = e.data;
      this.dialogs.isDeleteVisible = !this.dialogs.isDeleteVisible;
    },
    async handleConfirmDeleteSetting() {
      try {
        await deletter.setting(this.privates.deletedableSetting.id);
        this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
        this.privates.deletedableSetting = null;
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCancelDeleteSetting() {
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
