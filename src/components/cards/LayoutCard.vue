<template>
  <div>
    <md-card>
      <md-card-header>
        <div class="md-title">{{ title }}</div>
        <md-divider></md-divider>
      </md-card-header>
      <md-card-content>
        <div v-if="showEmptyMessage">
          <md-empty-state
            md-icon="block"
            :md-label="title"
            md-description="Keine Daten vorhanden."
          >
          </md-empty-state>
        </div>
        <div v-else><slot name="else-part"></slot></div>
      </md-card-content>
      <slot name="action-part"></slot>
    </md-card>
  </div>
</template>

<script>
export default {
  name: "LayoutCard",
  props: {
    showEmptyMessage: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: "Keine Daten vorhanden."
    }
  }
};
</script>
