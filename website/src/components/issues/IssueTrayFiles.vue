<template>
  <div>
    <el-table :data="issues" style="width: 100%" class="trayClass" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"/>
      <el-table-column property="detail" :label="$t(`message.common.file_label`)" show-overflow-tooltip/>
    </el-table>
    <br/>

    <el-button type="primary" size="large" plain :disabled="selection.length === 0" style="width: 100%;margin-top: 5px" @click="validate">
      {{ $t(`message.common.fix_button`) }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: "IssueTrayFiles",
  emits: ['fix-selection'],
  props: {
    issues: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      selection: []
    }
  },
  methods: {
    handleSelectionChange: function (val) {
      this.selection = val;
    },
    validate: function () {
      this.$emit('fix-selection', this.selection);
    }
  },
}
</script>

<style>
.trayClass .el-table__cell {
  padding: 0 !important;
}
</style>