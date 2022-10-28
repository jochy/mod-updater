<template>
  <el-table ref="updateTable" :data="toUpdate" style="width: 100%;">
    <el-table-column>
      <template #default="mod">
        <h4>
          {{ mod.row.name }}
          <el-switch style="float:right;"
                     v-model="ignore[mod.row.id]"
                     :active-text="$t(`message.update.ignore_until_next_update`)"
          />
        </h4>
        <div v-if="!ignore[mod.row.id]">
          <el-table v-for="file in mod.row.files" :key="file"
                    :data="[{...file.local, type: 'Remove'}, {...file, type: 'Install'}]"
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
          >
            <el-table-column :label="$t(`message.common.operation_label`)" width="100px">
              <template #default="scope">
                {{ $t(`message.update.operation_type_${scope.row.type.toLowerCase()}`) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t(`message.common.file_label`)">
              <template #default="scope">
                <div v-if="scope.row.type === 'Remove'">
                  <el-select style="width: 100%" disabled :model-value="scope.row.name">
                    <el-option :label="scope.row.name" :value="scope.row.name">{{ scope.row.name }}</el-option>
                  </el-select>
                  <ul :set="common = longestCommonStringFromList(scope.row.createdFiles)"
                      style="margin-top: 5px; margin-bottom: 0">
                    <li v-for="f in scope.row.createdFiles" :key="f" style="list-style-type: none">
                      {{ f.replace(common, '') }}
                    </li>
                  </ul>
                </div>
                <div v-else-if="scope.row.available != null" class="install-div">
                  <el-select v-model="selected[mod.row.id + scope.row.local.name]"
                             :placeholder="$t(`message.common.select_file`)" style="width: 100%" clearable
                             @change="(val) => selectLink(val,mod.row,scope.row.local.name)">
                    <el-option v-for="item in scope.row.available" :key="item.name" :label="item.name"
                               :value="item.link">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right;color: var(--el-text-color-secondary);font-size: 13px;">
                      {{ item.version }}
                    </span>
                    </el-option>
                  </el-select>
                  <div
                      :set="cond = selected[mod.row.id + scope.row.local.name] != null && scope.row.available.filter(it => it.link === selected[mod.row.id + scope.row.local.name] && it.internalFiles != null).length > 0">
                    <el-tree
                        v-if="cond"
                        :props="defaultProps"
                        :key="generateKey(scope, mod)"
                        :ref="`tree_${mod.row.id + scope.row.local.name}`"
                        :data="generateData(selected[mod.row.id + scope.row.local.name], scope.row)"
                        :default-checked-keys="checked[mod.row.id + scope.row.local.name]"
                        @check="treeFileChecked(mod.row.id + scope.row.local.name)"
                        node-key="label"
                        show-checkbox
                    />
                    <el-alert
                        v-if="selected[mod.row.id + scope.row.local.name] == null || selected[mod.row.id + scope.row.local.name] === '' || (cond && checked[mod.row.id + scope.row.local.name]?.length === 0)"
                        :closable="false" show-icon style="margin-top: 5px;"
                        :title="$t(`message.update.no_file_selected_so_nothing_will_be_done`)"
                        type="warning"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t(`message.common.version_label`)" width="100px">
              <template #default="scope">
                <span v-if="scope.row.version != null">{{ scope.row.version }}</span>
                <span v-else>{{ extractVersion(scope, mod) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-alert v-else
                  :closable="false" show-icon style="margin-top: 5px;"
                  :title="$t(`message.update.will_ignore_this_update_until_the_next_one_available`)"
                  type="warning"/>
      </template>
    </el-table-column>
  </el-table>
  <el-button type="primary" class="btn-block" @click="validateFileSelected">{{ $t(`message.common.update_label`) }}</el-button>
</template>

<script>
import Semver from "../../lib/Semver";

export default {
  name: "Update",
  emits: ['close'],
  props: {
    toUpdate: {
      type: Array,
      required: true
    }
  },
  data: function () {
    return {
      finalToUpdate: [],
      ignore: {},
      selected: {},
      checked: {},
      treeKeys: {},
      defaultProps: {
        children: 'children',
        label: 'label',
      }
    }
  },
  methods: {
    extractVersion: function (scope, mod) {
      try {
        let version = scope.row.available.find(item => item.link === this.selected[mod.row.id + scope.row.local.name])?.version;
        if (version == null) {
          return "";
        }
        return version;
      } catch (e) {
        return "";
      }
    },
    generateKey: function (scope, mod) {
      if (this.treeKeys[`tree_${mod.row.id + scope.row.local.name}`] == null) {
        this.treeKeys[`tree_${mod.row.id + scope.row.local.name}`] = 0;
      }
      return this.treeKeys[`tree_${mod.row.id + scope.row.local.name}`];
    },
    tableRowClassName: function (row) {
      if (row.row.type === 'Remove') {
        return 'danger-row'
      } else if (row.row.type === 'Install') {
        return 'success-row'
      }
      return '';
    },
    treeFileChecked: async function (key) {
      this.checked[key] = this.$refs[`tree_${key}`][0].getCheckedKeys();
      this.treeKeys[`tree_${key}`] = this.treeKeys[`tree_${key}`] + 1;
    },
    generateData: function (selectedFile, row) {
      const file = row.available.filter(it => it.link === selectedFile);
      if (file.length === 0 || file[0].internalFiles == null) {
        return [];
      }
      return file[0].internalFiles.map(it => {
        return {label: it}
      });
    },
    longestCommonStringFromList: function (array) {
      array = array.map(res => {
        if (res.includes('/')) {
          return res.substring(0, res.lastIndexOf('/') + 1);
        } else if (res.includes('\\')) {
          return res.substring(0, res.lastIndexOf('\\') + 1);
        }
        return "";
      })

      if (array.length === 1) {
        return array[0];
      }
      let A = array.concat().sort(),
          a1 = A[0], a2 = A[A.length - 1], L = a1.length, i = 0;
      while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
      return a1.substring(0, i);
    },
    selectLink: function (val, row, filename) {
      if (val === "") {
        this.checked[row.id + filename] = undefined;
      } else {
        this.checked[row.id + filename] = this.guessFilesToCheck(row.files.filter(it => it.local.name === filename)[0], row.files
            .filter(it => it.local.name === filename)
            .map(it => it.available)
            .flat()
            .filter(it => it.link === val)[0]);
      }
    },
    guessFilesToCheck: function (installedFile, toInstallFile) {
      // Try catch because dirty :)
      try {
        const installedLink = installedFile.available
            .filter(it => it.name === installedFile.local.name && it.version === installedFile.local.version)[0];
        const allFilesFromOriginalLink = installedLink.internalFiles
            .map(it => {
              if (it.includes('/')) {
                return it.substring(it.lastIndexOf('/') + 1);
              } else if (it.includes('\\')) {
                return it.substring(it.lastIndexOf('\\') + 1);
              }
              return it;
            });

        const allInstalledFiles = installedFile.local.createdFiles.map(it => {
          if (it.includes('/')) {
            return it.substring(it.lastIndexOf('/') + 1);
          } else if (it.includes('\\')) {
            return it.substring(it.lastIndexOf('\\') + 1);
          }
          return it;
        });

        const notInstalledFiles = allFilesFromOriginalLink.filter(it => !allInstalledFiles.includes(it));
        return toInstallFile.internalFiles.filter(it => notInstalledFiles.filter(f => it.endsWith(f)).length === 0);
      } catch (e) {
        console.log(e);
        if (toInstallFile.internalFiles != null) {
          return toInstallFile.internalFiles.flat();
        } else {
          return [];
        }
      }
    },
    validateFileSelected: function () {
      this.finalToUpdate = [];
      this.toUpdate
          .filter(mod => !this.ignore[mod.id])
          .forEach(mod => {
            let files = [];
            mod.files.forEach(file => {
              if (this.selected[mod.id + file.local.name] != null && this.selected[mod.id + file.local.name] !== "") {
                file.needHelp = undefined;
                file.toUpdate = file.available.find(item => item.link === this.selected[mod.id + file.local.name]);

                if (file.toUpdate.internalFiles == null || file.toUpdate.internalFiles.length === 0
                    || (this.checked[mod.id + file.local.name] != null && this.checked[mod.id + file.local.name].length > 0)) {
                  file.toUpdate.checked = this.checked[mod.id + file.local.name];
                  files.push(file);
                } else {
                  console.debug("No files checked");
                }
              }
            });
            mod.files = files;
            if (mod.files.length > 0) {
              this.finalToUpdate.push(mod);
            }
          });
      window.ipcRenderer.send('do-update', JSON.parse(JSON.stringify(this.finalToUpdate)));
      console.log(this.ignore);
      if (Object.keys(this.ignore).length > 0) {
        let toIgnoreUntil = Object.keys(this.ignore)
            .map(id => this.toUpdate.find(it => it.id === id))
            .map(mod => {
              let maxVersion = mod.files[0].available[0].version;
              mod.files
                  .map(file => file.available)
                  .flat()
                  .forEach(file => {
                    if (Semver.isNewer(file.version, maxVersion)) {
                      maxVersion = file.version;
                    }
                  });
              return {
                id: mod.id,
                version: maxVersion
              }
            });
        window.ipcRenderer.send('ignore-update', toIgnoreUntil);
      }
      this.$emit('close');
    }
  },
  mounted() {
    this.toUpdate.forEach(mod => {
      mod.files.forEach(file => {
        if (file.toUpdate != null) {
          this.selected[mod.id + file.local.name] = file.toUpdate.link;
          this.checked[mod.id + file.local.name] = this.guessFilesToCheck(file, file.toUpdate);
        }
      });
    });
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

.btn-block {
  margin-top: 10px;
  width: 100%
}

.install-div > div > .el-tree {
  background-color: transparent !important;
  margin-top: 5px;
}

</style>