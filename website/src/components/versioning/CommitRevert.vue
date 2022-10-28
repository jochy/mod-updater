<template>
  <div>
    <p style="margin-top: 0;">
      <b style="font-size: 20px">{{ $t(`message.commit.${commit.msg.action}`) }}</b><br/>
      <span v-if="innerDetail?.action != null">{{ $t(`message.commit.${innerDetail.action}`) }}</span>
      {{ innerDetail?.detail?.modName }}<br/>
      <span class="version">
        <span v-if="innerDetail?.detail?.file != null">{{ innerDetail.detail.file }}</span>
        <span v-if="innerDetail?.detail?.previousVersion != null"
              style="margin-left: 5px;">{{ innerDetail.detail.previousVersion }}</span>
        <span v-if="innerDetail?.detail?.version != null"> -> {{ innerDetail.detail.version }}</span>
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: "CommitRevert",
  props: {
    commit: {
      type: Object,
      required: true
    }
  },
  computed: {
    innerDetail: function () {
      if (this.commit?.msg?.detail == null) {
        return null;
      }
      let detail = JSON.parse(this.commit.msg.detail);
      return detail;
    }
  }
}
</script>

<style scoped>
.version {
  color: var(--el-text-color-secondary);
  line-height: 1;
  font-size: var(--el-font-size-small);
}
</style>