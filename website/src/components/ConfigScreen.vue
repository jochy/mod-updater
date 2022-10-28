<template>
  <div>
    <h2>{{ $t(`message.menu.settings_menu_tooltip`) }}</h2>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t(`message.menu.settings_menu_tooltip`)" name="config">
        <config/>
      </el-tab-pane>
      <el-tab-pane :label="$t(`message.common.logs_label`)" name="logs">
        <Logs/>
      </el-tab-pane>
      <el-tab-pane :label="$t(`message.common.others_label`)" name="other">
        <other/>
      </el-tab-pane>
      <el-tab-pane :label="$t(`message.common.about_label`)" name="about">
        <about-settings/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Config from "@/components/Config.vue";
import Logs from "@/components/settings/Logs.vue";
import AboutSettings from "@/components/settings/AboutSettings.vue";
import Other from '@/components/settings/Other.vue';

export default {
  name: "ConfigScreen",
  components: {Config, Logs, AboutSettings, Other},
  data: function () {
    return {
      activeName: 'config'
    }
  }
}
</script>
