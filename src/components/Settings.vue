<template>
  <div>
    <md-table :value="userSettings" md-card>
      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Position" md-numeric>{{
          item.pos
        }}</md-table-cell>
        <md-table-cell md-label="Breakfast Prize" md-numeric>{{
          item.breakfastPrize
        }}</md-table-cell>
        <md-table-cell md-label="Lunch Prize" md-numeric>{{
          item.lunchPrize
        }}</md-table-cell>
        <md-table-cell md-label="Afternoon Snack Prize" md-numeric>{{
          item.afternoonSnackPrize
        }}</md-table-cell>
        <md-table-cell md-label="Expiration Date">{{
          item.expirationDate | formattedDate
        }}</md-table-cell>
      </md-table-row>
    </md-table>

    <div class="container-button">
      <md-button class="md-fab"> <md-icon>add</md-icon> </md-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
  computed: {
    ...mapState(["userSettings"])
  },
  filters: {
    formattedDate: formattedDateFilter
  },
  methods: {}
};
</script>

<style>
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
