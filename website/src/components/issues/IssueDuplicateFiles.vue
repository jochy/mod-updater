<template>
  <div>
    <el-table :data="issues" style="width: 100%" class="duplicate">
      <el-table-column :label="$t(`message.common.file_label`)" show-overflow-tooltip>
        <template #default="scope">
          <div v-if="issuesCopy.find(it => it.id === scope.row.id) != null">
            <div v-for="file in scope.row.detail" :key="file">{{ file.file }}</div>
            <div>
              <el-select v-model="issuesCopy.find(it => it.id === scope.row.id).keep"
                         :placeholder="$t(`message.common.select_the_file_to_keep`)" clearable
                         size="large" style="width: 100%; margin-top: 5px"
                         @change="handleSelectionChange">
                <el-option
                    v-for="file in scope.row.detail"
                    :key="file"
                    :label="file.file"
                    :value="file.file"
                >
                  <span style="float: left">{{ file.file }}</span>
                  <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                      {{ new Date(file.lastUpdate).toLocaleString() }}
                    </span>
                </el-option>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <br/>

    <el-button size="large" type="primary" plain :disabled="selection.length === 0" style="width: 100%;margin-top: 5px" @click="validate">
      {{ $t(`message.common.fix_button`) }}
    </el-button>
  </div>
</template>

<script>
export default {
  name: "IssueDuplicateFiles",
  emits: ['fix-selection'],
  props: {
    issues: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      keep: {},
      issuesCopy: JSON.parse(JSON.stringify(this.issues)),
      selection: []
    }
  },
  methods: {
    handleSelectionChange: async function () {
      await this.$nextTick();
      this.selection = this.issuesCopy.filter(it => it.keep != null && it.keep !== "");
    },
    validate: function () {
      this.$emit('fix-selection', this.selection);
    }
  },
}
</script>

<style>

.duplicate.el-table td.el-table__cell {
  border-bottom: dashed 1px var(--el-color-info);
}

</style>