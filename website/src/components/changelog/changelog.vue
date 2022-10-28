<template>
  <div>
    <el-dialog
        v-model="displayChangelog"
        title="Changelog"
        width="60%"
        style="text-align: left"
    >
      <Changelog1120 v-if="version === '1.12.0'"/>
      <Changelog1130 v-if="version === '1.13.0'"/>
      <Changelog20000 v-if="version === '2.0.0'"/>
      <Changelog20100 v-if="version === '2.1.0'"/>
      <Changelog20200 v-if="version === '2.2.0'"/>
      <Changelog20300 v-if="version === '2.3.0'"/>
      <Changelog20400 v-if="version === '2.4.0'"/>
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

import Changelog1120 from "@/components/changelog/Changelog1120.vue";
import Changelog1130 from "@/components/changelog/Changelog1130.vue";
import Changelog20000 from "@/components/changelog/Changelog20000.vue";
import Changelog20100 from "@/components/changelog/Changelog20100.vue";
import Changelog20200 from "@/components/changelog/Changelog20200.vue";
import Changelog20300 from "@/components/changelog/Changelog20300.vue";
import Changelog20400 from "@/components/changelog/Changelog20400.vue";
import Changelog20500 from "@/components/changelog/Changelog20500.vue";

export default {
  name: "changelog",
  components: {
    Changelog1120, Changelog1130, Changelog20000, Changelog20100, Changelog20200, Changelog20300, Changelog20400, Changelog20500
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
    this.displayChangelog = ['2.0.0'].includes(this.version);
    console.log(this.displayChangelog);
  }
}
</script>
