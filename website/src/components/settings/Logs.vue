<template>
  <div>
    <el-input
        v-loading="loading"
        v-model="logs"
        :rows="20"
        type="textarea"
        readonly
    />
    <el-button-group style="margin-top: 20px">
      <el-button type="primary" @click="askRefreshLogs">{{ $t(`message.config.refresh_logs_button`) }}</el-button>
      <el-button type="primary" @click="askOpenLogFile">{{ $t(`message.config.open_log_file_button`) }}</el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: "Logs",
  data: function () {
    return {
      loading: false,
      logs: null
    }
  },
  methods: {
    askRefreshLogs: async function() {
      this.loading = true;
      window.ipcRenderer.send('ask-logs');
    },
    askOpenLogFile: function() {
      window.ipcRenderer.send('open-logs');
    },
    refreshLogs: function(msg) {
      this.logs = msg;
      this.loading = false;
    }
  },
  mounted() {
    window.ipcRenderer.on('logs', (event, msg) => this.refreshLogs(msg));
    this.askRefreshLogs();
  },
  unmounted() {
    window.ipcRenderer.removeAllListeners('logs');
  }
}
</script>
