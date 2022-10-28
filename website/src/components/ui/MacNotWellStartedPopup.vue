<template>
  <el-dialog
      v-model="showDialog"
      title="Mac issue"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
  >
    <el-result
        icon="error"
        title="Application not well started"
    >
      <template #subTitle>
        Please, close the application and start it from the <el-tag type="info" size="mini">Terminal</el-tag> by using this command:
        <pre>
          open /Applications/sims-mod-updater.app/Contents/MacOS/sims-mod-updater
        </pre>
      </template>
    </el-result>
  </el-dialog>
</template>

<script>
export default {
  name: "MacNotWellStartedPopup",
  data: function () {
    return {
      showDialog: this.modelValue
    }
  },
  methods: {
    close() {
      this.showDialog = false;
      this.$emit('update:modelValue', false);
    }
  },
  mounted() {
    this.showDialog = this.modelValue
  }
}
</script>
