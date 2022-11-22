<template>
  <div v-loading="commits == null">
    <div>
      <el-button type="danger" plain style="float: right" @click="blur($event);resetRepo()">{{ $t(`message.commit.reset_history_button`) }}</el-button>
      <h2>{{ $t(`message.commit.title`) }}</h2>
    </div>
    <div style="text-align: left" v-if="commitsToDisplay.length > 0">
      <el-timeline>
        <el-timeline-item
            v-for="commit in commitsToDisplay"
            :key="commit.sha"
            :type="nodeType(commit)"
            size="large"
            :timestamp="date(commit)"
        >
          <el-link :underline="false" @click="selectDetails(commit)">
            <commit :commit="commit"/>
          </el-link>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-drawer v-model="display"
               :title="$t(`message.commit.history_details_title`)"
               size="80%"
    >
      <ads style="width: 100%; overflow-x: hidden" type="leaderboard"/>

      <div v-loading="detail == null">
        <div v-if="detail != null">
          <el-descriptions :title="$t(`message.commit.history_change_details_desc.title`)" border size="small">
            <el-descriptions-item :label="$t(`message.commit.history_change_details_desc.reason`)" v-if="detail.msg?.action != null">
              {{ $t(`message.commit.${detail.msg.action}`) }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t(`message.commit.history_change_details_desc.date`)" v-if="detail.date != null">{{
                new Date(detail.date).toLocaleString()
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t(`message.commit.history_change_details_desc.mod`)" v-if="detail.msg?.detail?.modName != null">{{
                detail.msg.detail.modName
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t(`message.commit.history_change_details_desc.mod_files`)" v-if="detail.msg?.detail?.file != null">{{
                detail.msg.detail.file
              }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t(`message.commit.history_change_details_desc.previous_version`)" v-if="detail.msg?.detail?.previousVersion != null">
              {{ detail.msg.detail.previousVersion }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t(`message.common.version_label`)" v-if="detail.msg?.detail?.version != null">
              {{ detail.msg.detail.version }}
            </el-descriptions-item>
          </el-descriptions>
          <el-divider/>
          <div v-if="detail.diff.length > 0" style="float: right; margin-bottom: 10px;">
            <el-popconfirm :title="$t(`message.commit.confirm_revert_change`)" @confirm="askRevert" width="400px">
              <template #reference>
                <el-button type="danger" plain>{{ $t(`message.commit.confirm_revert_change_button`) }}</el-button>
              </template>
            </el-popconfirm>
          </div>
          <div class="el-descriptions__title" style="text-align: left">Changes</div>
          <div v-if="detail.diff.length > 0" style="margin-top: 10px">
            <el-table :data="detail.diff" style="width: 100%" :row-class-name="tableRowClassName">
              <el-table-column prop="type" :label="$t(`message.common.operation_label`)" width="180">
                <template #default="scope">
                  <span v-if="scope.row.type != null">{{ $t(`message.commit.patch.${scope.row.type}`) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="path" :label="$t(`message.common.file_label`)"/>
            </el-table>
          </div>
          <div v-else style="text-align: left">
            <el-alert v-if="detail.msg?.action !== 'revert_change'" :title="$t(`message.commit.no_file_changed`)" type="warning"
                      show-icon :closable="false">
              {{ $t(`message.commit.no_file_changed_desc`) }}
            </el-alert>
            <el-alert v-else :title="$t(`message.commit.no_file_changed`)" type="warning" show-icon :closable="false">
              {{ $t(`message.commit.no_file_changed_revert_desc`) }}
            </el-alert>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import Commit from "@/components/versioning/Commit.vue";
import Ads from "@/components/google/Ads.vue";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Versioning",
  components: {Commit, Ads},
  data: function () {
    return {
      detail: null,
      display: false,
      page: 0,
      perPage: 100,
      commitsToDisplay: []
    }
  },
  watch: {
    scroll: async function (val) {
      if (val > 0.9 && this.commitsToDisplay.length < this.commits.length) {
        this.commitsToDisplay.push(...this.commits.slice(this.page * this.perPage, Math.min((this.page + 1) * this.perPage, this.commits.length)));
        this.page = this.page + 1;
      }
    },
    commits: async function() {
      if (this.commitsToDisplay.length === 0) {
        this.page = 1;
        this.commitsToDisplay.push(...this.commits.slice(0, Math.min(this.perPage, this.commits.length)));
      } else {
        this.page = 1;
        this.commitsToDisplay = [];
        this.commitsToDisplay.push(...this.commits.slice(0, Math.min(this.perPage, this.commits.length)));
      }
    }
  },
  computed: {
    ...mapGetters(['commits', 'scroll']),
  },
  methods: {
    ...mapMutations(['setCommits']),
    blur: function (el) {
      if (el.target.tagName !== 'BUTTON' && el.target.parentElement.tagName === 'BUTTON') {
        el.target.parentElement.blur();
      } else {
        el.target.blur();
      }
    },
    resetRepo: function () {
      ElMessageBox.confirm(
          this.$t(`message.commit.reset_history_confirm.desc`),
          this.$t(`message.commit.reset_history_confirm.title`),
          {
            distinguishCancelAndClose: true,
            dangerouslyUseHTMLString: true,
            confirmButtonText: this.$t(`message.commit.reset_history_button`),
            confirmButtonClass: 'el-button--danger',
            cancelButtonText: this.$t(`message.common.cancel_button`),
          }
      ).then(() => {
        window.ipcRenderer.send('reset-history');
      }).catch(() => true);
    },
    selectDetails: function (commit) {
      this.detail = null;
      this.display = true;
      window.ipcRenderer.send('commit-detail-ask', commit.sha);
    },
    nodeType: (commit) => {
      switch (commit.msg.action) {
        case 'delete_mod':
          return 'danger';
        case 'install_mod':
          return 'primary';
        case 'update_mod':
          return 'success';
        case 'sort_mods':
        case 'revert_change':
        case 'force_revert_change':
        case 'reset_versioning':
        case 'issue_fixed':
          return 'warning';
        default:
          return 'info'
      }
    },
    askRevert: function () {
      console.log("Asking revert");
      window.ipcRenderer.send('commit-ask-revert', this.detail.sha);
    },
    date: (commit) => {
      return new Date(commit.date).toLocaleString();
    },
    tableRowClassName: function (row) {
      if (row.row.type === 'remove') {
        return 'danger-row';
      } else if (row.row.type === 'add') {
        return 'success-row';
      } else if (row.row.type === 'modified') {
        return 'warning-row';
      }
      return '';
    },
  },
  mounted() {
    this.setCommits(null);
    window.ipcRenderer.send('retrieve-commits');
    const _this = this;
    window.ipcRenderer.on('commit-detail-loaded', (event, msg) => {
      _this.detail = msg;
    });
    window.ipcRenderer.on('commit-ask-revert-result', (event, msg) => {
      if (msg.success === true) {
        ElMessage({
          message: 'Revert done',
          type: 'success',
        });
        _this.display = false;
        _this.detail = null;
      } else {
        ElMessageBox.confirm(
            'The revert failed because files included in this change have been modified since this change. <br/>Do you want to force the revert ? <br/><b>You will lose all changes after this one and this can not be undone</b>',
            'Revert failed',
            {
              distinguishCancelAndClose: true,
              dangerouslyUseHTMLString: true,
              confirmButtonText: 'Force revert',
              confirmButtonClass: 'el-button--danger',
              cancelButtonText: 'Do nothing',
            }
        ).then(() => ElMessageBox.confirm(
            '<b>You will lose all changes after this one and this can not be undone</b><br/>Are you sure ?',
            'Are you sure ?',
            {
              distinguishCancelAndClose: true,
              dangerouslyUseHTMLString: true,
              confirmButtonText: 'Yes, I am sure',
              confirmButtonClass: 'el-button--danger',
              cancelButtonText: 'No, do nothing',
            }
        )).then(() => {
          window.ipcRenderer.send('force-revert-commit', _this.detail.sha);
        }).catch(() => null);
      }
    });
  },
  unmounted() {
    window.ipcRenderer.removeAllListeners('commit-detail-loaded');
    window.ipcRenderer.removeAllListeners('commit-ask-revert-result');
  }
}
</script>

<style>
.el-table .danger-row {
  background-color: var(--el-color-danger-light-9) !important;
}

.el-table .success-row {
  background-color: var(--el-color-success-light-9) !important;
}

.el-table .warning-row {
  background-color: var(--el-color-warning-light-9) !important;
}
</style>