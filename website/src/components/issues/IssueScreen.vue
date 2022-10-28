<template>
  <div>
    <h2>Issues</h2>
    <div v-if="issues.length === 0">
      <el-alert :title="$t(`message.common.no_issue_found`)" type="success" :closable="false" center/>
    </div>
    <div v-else>
      <el-tabs ref="tabs">
        <el-tab-pane v-if="trayIssues.length > 0" :label="$t(`message.common.tray_files_label`)">
          <issue-tray-files :issues="trayIssues" @fix-selection="fixSelection"/>
        </el-tab-pane>
        <el-tab-pane v-if="zipIssues.length > 0" :label="$t(`message.common.zip_file_in_mods_folder_label`)">
          <issue-tray-files :issues="zipIssues" @fix-selection="fixSelection"/>
        </el-tab-pane>
        <el-tab-pane v-if="ts4scriptIssues.length > 0" :label="$t(`message.common.ts4script_files_label`)">
          <issue-tray-files :issues="ts4scriptIssues" @fix-selection="fixSelection"/>
        </el-tab-pane>
        <el-tab-pane v-if="duplicateFiles.length > 0" :label="$t(`message.common.duplicated_files`)">
          <issue-duplicate-files :issues="duplicateFiles" @fix-selection="fixSelection"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import {mapGetters} from "vuex";
import IssueTrayFiles from "@/components/issues/IssueTrayFiles.vue";
import IssueDuplicateFiles from "@/components/issues/IssueDuplicateFiles.vue";

export default {
  name: "IssueScreen",
  components: {IssueTrayFiles, IssueDuplicateFiles},
  data: function () {
    return {
    }
  },
  computed: {
    ...mapGetters(['issues']),
    trayIssues: function () {
      return this.issues.filter(it => it.type === 'tray-files-misplaced');
    },
    duplicateFiles: function () {
      return this.issues.filter(it => it.type === 'duplicate-file');
    },
    ts4scriptIssues: function() {
      return this.issues.filter(it => it.type === 'ts4script-files-misplaced');
    },
    zipIssues: function() {
      return this.issues.filter(it => it.type === 'zip-file-in-mods-folder');
    }
  },
  methods: {
    fixSelection: function(issues) {
      window.ipcRenderer.send('fix-issues', JSON.parse(JSON.stringify(issues)));
    }
  }
}
</script>
