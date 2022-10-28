<template>
  <el-descriptions :column="1" style="display: inline-block" border>
    <el-descriptions-item :label="$t(`message.common.version_label`)" label-align="right" align="center">
      <el-tag v-if="applicationManifest != null">{{ applicationManifest.version }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item :label="$t(`message.common.developed_by`)" label-align="right" align="center">
      <a href="https://www.buymeacoffee.com/joch" target="_blank">Joch (Alex)</a>
    </el-descriptions-item>
    <el-descriptions-item label="Copyright" label-align="right" align="center">
      © All rights reserved
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "AboutSettings",
  computed: {
    ...mapGetters(['applicationManifest'])
  }
}
</script>
