<template>
  <div>
    <el-dialog
        v-model="displayChangelog"
        title="Changelog"
        width="60%"
        style="text-align: left"
    >
      <ChangelogContent v-if="version === '2.6.0'"/>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="displayChangelog = false">Got it!</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ChangelogContent from "@/components/changelog/ChangelogContent.vue";

export default {
  name: "changelog",
  components: {
    ChangelogContent
  },
  props: {
    version: {
      type: String
    }
  },
  data: function () {
    return {
      displayChangelog: false,
    }
  },
  mounted() {
    this.displayChangelog = ['2.5.0'].includes(this.version);
    console.log(this.displayChangelog);
  }
}
</script>
