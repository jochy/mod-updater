<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdWbA9Jp_gObjX5XknU4pS1A3TncMjuNTMyhvGZThPpHuy-jw/viewform?embedded=true"
            frameborder="0" marginheight="0" marginwidth="0" allowtransparency="true" style="width: 100%; height: 1100px">Loading…
        </iframe>
      </el-col>
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10">
        <iframe src="https://discord.com/widget?id=929781651775561828&theme=dark" style="margin-top: 10px;width: 100%; height: 850px"
                allowtransparency="true" frameborder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Contact",
  mounted() {
    window.updateTitleAndDescription('Sims mods updater Contact', 'Feel free to contact any Sims mods updater developer.');
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>