<template>
  <div class="md-layout md-alignment-top-center setting-container_height">
    <base-card
      class="md-layout-item md-size-95"
      title="Preishistorie"
      :showEmptyMessage="showErrorMessage"
    >
      <template slot="else-part">
        <price-history-table
          :settings="settings"
          @on-edit-setting="handleShowEditDialog"
          @on-delete-setting="handleShowDeleteDialog"
        />
      </template>
      <template slot="action-part">
        <md-card-actions>
          <md-button @click="handleShowCreateDialog"
            >Neuen Eintrag anlegen</md-button
          >
        </md-card-actions>
      </template>
    </base-card>

    <edit-setting-dialog
      :isVisible="dialogs.isEditVisible"
      :editableSetting="privates.editableSetting"
      @on-confirm="handleConfirmEditSetting"
      @on-cancel="handleCancelEditSetting"
    />

    <md-dialog-confirm
      :md-active.sync="dialogs.isDeleteVisible"
      md-title="Wollen Sie wirklich diesen Eintrag löschen?"
      md-confirm-text="Ja"
      md-cancel-text="Nein"
      @md-confirm="handleConfirmDeleteSetting"
      @md-cancel="handleCancelDeleteSetting"
    />

    <create-setting-dialog
      :isVisible="dialogs.isCreateVisible"
      @on-confirm="handleConfirmCreateSetting"
      @on-cancel="handleCancelCreateSetting"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

import { ActionType, MutationType, StateProperty } from "@/helper";
import { creator, updater, deletter } from "@/database";

import BaseCard from "./cards/BaseCard.vue";
import PriceHistoryTable from "./datatables/PriceHistoryTable.vue";
import CreateSettingDialog from "./dialogs/CreateSettingDialog.vue";
import EditSettingDialog from "./dialogs/EditSettingDialog.vue";

export default {
  name: "Settings",
  components: {
    "base-card": BaseCard,
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
        isEditVisible: false,
        isDeleteVisible: false,
        isCreateVisible: false
      },
      privates: {
        editableSetting: {},
        deletedableSetting: null
      }
    };
  },
  methods: {
    // editing
    handleShowEditDialog(e) {
      let setting = e.data;
      setting.expirationDate = new Date(setting.expirationDate.seconds * 1000);
      this.privates.editableSetting = setting;
      this.handleCancelEditSetting();
    },
    async handleConfirmEditSetting(e) {
      try {
        await updater.setting(this.privates.editableSetting.id, e.data);
        this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
        this.privates.editableSetting = {};
        this.handleCancelEditSetting();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCancelEditSetting() {
      this.dialogs.isEditVisible = !this.dialogs.isEditVisible;
    },
    // deleting
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
    },
    // creation
    handleShowCreateDialog() {
      this.dialogs.isCreateVisible = !this.dialogs.isCreateVisible;
    },
    async handleConfirmCreateSetting(e) {
      try {
        await creator.setting(this[StateProperty.CURRENT_USER].uid, e.data);
        this.$store.dispatch(ActionType.FETCH_USER_SETTINGS);
        this.handleCancelCreateSetting();
      } catch (error) {
        this.$store.commit(MutationType.SET_CURRENT_ERROR, error);
      }
    },
    handleCancelCreateSetting() {
      this.dialogs.isCreateVisible = !this.dialogs.isCreateVisible;
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
