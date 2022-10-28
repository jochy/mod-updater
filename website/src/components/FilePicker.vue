<template>
  <div>
    <el-alert :title="$t(`message.file_picker.select_files_to_install_title`)" type="warning" :closable="false" center
              v-if="!noFiles && mod.files.length > 1">
      {{ $t(`message.file_picker.select_files_to_install_desc`) }}
    </el-alert>
    <el-alert :title="$t(`message.file_picker.no_files_to_install_title`)" type="error" :closable="false" center v-if="noFiles">
      {{ $t(`message.file_picker.no_files_to_install_desc`) }}
    </el-alert>
    <el-table
        v-if="!noFiles"
        ref="multipleTable"
        :data="mod.files"
        style="width: 100%"
    >
      <el-table-column :label="$t(`message.common.name_label`)">
        <template #default="scope">
          <el-tree
              :props="defaultProps"
              :key="`tree_${scope.row.name}_${keyIdx}`"
              :ref="`tree_${scope.row.name}`"
              :data="[generateData(scope.row)]"
              node-key="label"
              :default-checked-keys="getDefaultChecked(scope.row.name)"
              :default-expanded-keys="nodeExpanded"
              @check="handleSelectionChange(scope.row)"
              @node-expand="nodeExpand(scope.row.name)"
              @node-collapse="nodeCollapse(scope.row.name)"
              show-checkbox
          />
        </template>
      </el-table-column>
      <el-table-column v-if="!hideUselessColumns" prop="date" :label="$t(`message.common.date_label`)" width="120" show-overflow-tooltip>
        <template #default="scope">{{ displayDate(scope.row.date) }}</template>
      </el-table-column>
      <el-table-column v-if="!hideUselessColumns" prop="size" :label="$t(`message.common.size_label`)" width="100" show-overflow-tooltip/>
      <el-table-column :label="$t(`message.common.version_label`)" width="100" show-overflow-tooltip>
        <template #default="scope">{{ toVersion(scope.row.date) }}</template>
      </el-table-column>
    </el-table>
    <el-button type="primary" :disabled="multipleSelection.length === 0" style="margin-top: 10px; width: 100%"
               @click="validate">
      {{ $t(`message.common.install_button`) }}
    </el-button>
    <el-divider/>
    <ads style="width: 100%; overflow-x: hidden" type="leaderboard"/>
  </div>
</template>

<script>
import DateUtils from "../../lib/DateUtils";
import Ads from "@/components/google/Ads.vue";

export default {
  name: "FilePicker",
  components: {Ads},
  props: {
    mod: {
      type: Object,
      required: true
    }
  },
  data: function () {
    return {
      multipleSelection: [],
      childSelected: [],
      nodeExpanded: this.mod.files.filter(it => it.internalFiles != null && it.internalFiles.length > 1).map(it => it.name),
      noFiles: false,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      hideUselessColumns: false,
      keyIdx: 0,
    }
  },
  methods: {
    handleSelectionChange: function (file) {
      let checked = this.$refs[`tree_${file.name}`].getCheckedKeys()
          .filter(it => it !== file.name);
      let tmp = [...this.multipleSelection.filter(it => it.name !== file.name)];
      if (checked.length > 0) {
        tmp.push({...file, checked: checked});
      }
      if (file.internalFiles == null || file.internalFiles.length === 0) {
        if (this.$refs[`tree_${file.name}`].getCheckedKeys().length > 0) {
          tmp.push({...file});
        }
      }
      this.multipleSelection = tmp;
      const _this = this;
      this.$nextTick(() => _this.$forceUpdate());
      this.keyIdx = this.keyIdx + 1;
    },
    nodeExpand: function(name) {
      this.nodeExpanded.push(name);
    },
    nodeCollapse: function(name) {
      this.nodeExpanded = this.nodeExpanded.filter(it => it !== name);
      const _this = this;
      this.$nextTick(() => {
        _this.$forceUpdate();
      })
    },
    getDefaultChecked: function (name) {
      let toReturn = this.multipleSelection.filter(it => it.name === name).map(it => it.checked != null ? it.checked : it.name).flat();
      if (toReturn == null) {
        return [];
      }
      return toReturn;
    },
    toVersion: function (date) {
      if (date == null) return "";
      return DateUtils.dateToVersion(date);
    },
    displayDate: function (date) {
      return DateUtils.dateToString(date);
    },
    validate: function () {
      this.$emit('fileSelected', this.multipleSelection);
    },
    generateData: function (row) {
      if (row.internalFiles == null) {
        row.internalFiles = [];
      }
      return {
        label: row.name,
        children: row.internalFiles.map(it => {
          return {label: it, children: []}
        })
      };
    }
  },
  async mounted() {
    if (this.mod.files != null) {
      this.mod.files.forEach(f => {
        if (f.isRaw) {
          f.internalFiles = null;
        }
      })
    }

    if (this.mod.files == null || this.mod.files.length === 0) {
      this.noFiles = true;
    } else if (this.mod.files.length === 1 && (this.mod.files[0].internalFiles == null || this.mod.files[0].internalFiles.length === 1)) {
      try {
        this.multipleSelection = [
          {
            ...this.mod.files[0],
            checked: this.mod.files[0].internalFiles
          }
        ];
      } catch (e) {
        console.error('Error while auto checking ' + this.mod.id);
      }
    }

    await this.$nextTick();
    this.hideUselessColumns = window.innerWidth < 1100;
  }
}
</script>
