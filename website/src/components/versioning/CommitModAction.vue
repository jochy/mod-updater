<template>
  <div>
    <p style="margin-top: 0;">
      <b style="font-size: 20px">{{ $t(`message.commit.${commit.msg.action}`) }}</b><br/>
      {{ commit.msg.detail.modName }}<br/>
      <span class="version">
        <span v-if="commit.msg.detail.file != null">{{ commit.msg.detail.file }}</span>
        <span v-if="commit.msg.detail.previousVersion != null" style="margin-left: 5px;">{{ commit.msg.detail.previousVersion }}</span>
        <span v-if="commit.msg.detail.version != null"> -> {{ commit.msg.detail.version }}</span>
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: "CommitModAction",
  props: {
    commit: {
      type: Object,
      required: true
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