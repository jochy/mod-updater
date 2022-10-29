<template>
  <div>
    <div v-if="schedulerStatus != null && hasPendingTask">
      <el-row :gutter="20">
        <el-col :span="18">
          <div v-if="schedulerStatus.currentTasks.length > 0">
            <el-progress v-for="task in schedulerStatus.currentTasks" :key="task" style="margin-top: 5px"
                         :indeterminate="task.unknownProgression"
                         :percentage="task.unknownProgression ? 100 : Math.round(task.completion * 100)"
                         :text-inside="!task.unknownProgression"
                         :stroke-width="task.unknownProgression ? 10 : 18">
              <template #default="{ percentage }">
                <span>{{ translated(task.msg) }} {{ percentage != 100 ? ' - ' + percentage + ' %' : '' }}</span>
              </template>
            </el-progress>
          </div>
        </el-col>
        <el-col :span="6">
          <el-descriptions :column="1" :size="'small'" style="text-align: right">
            <el-descriptions-item :label="$t('message.scheduler.pending_tasks')" align="right">{{
                schedulerStatus.queuedTasks.length
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('message.scheduler.done')" align="right">{{
                schedulerStatus.doneTasks.length
              }}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
    </div>
    <div v-else-if="!disableAds">
      <div style="height: 90px; max-height: 90px">
        <ads type="footer" :reload="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Ads from "@/components/google/Ads.vue";

export default {
  name: "Scheduler",
  components: {Ads: Ads},
  computed: {
    ...mapGetters(['schedulerStatus', 'disableAds', 'hasPendingTask']),
  },
  methods: {
    translated: function(text) {
      const i18n = this.$t(text);
      if (i18n != text) {
        return i18n;
      }
      return text;
    }
  }
}
</script>

<style>
.el-progress-bar__inner {
  text-align: center !important;
}
</style>