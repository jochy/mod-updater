<template>
  <div>
    <el-button type="danger" @click="resetModCache">{{ $t(`message.config.reset_mod_cache_button`) }}</el-button>
  </div>
</template>

<script>
export default {
  name: "Other",
  methods: {
    resetModCache: function () {
      window.ipcRenderer.send('reset-mod-cache');
    }
  }
}
</script>
