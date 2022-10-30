<template>
  <div>
    <el-dialog
        v-model="displayChangelog"
        title="Changelog"
        width="60%"
        style="text-align: left"
    >
      <Changelog20500 v-if="version === '2.5.0'"/>
      <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="displayChangelog = false">Got it!</el-button>
      </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Changelog20500 from "@/components/changelog/Changelog20500.vue";

export default {
  name: "changelog",
  components: {
    Changelog20500
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
