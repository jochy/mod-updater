<template>
  <div>
    <el-form label-position="right" label-width="200px" :model="form" style="max-width: 100%"
             ref="form" :rules="rules">
      <el-form-item :label="$t(`message.mods.group_form_title`)" prop="name">
        <el-input v-model="form.name" :placeholder="$t(`message.mods.group_form_title`)"/>
      </el-form-item>
      <el-form-item :label="$t(`message.mods.group_form_description`)" prop="desc">
        <div style="width: 100%; text-align: left">
          <QuillEditor theme="snow" v-model:content="form.desc" contentType="html" />
        </div>
      </el-form-item>
    </el-form>
    <hr/>
    <mod-filter v-model="modsAfterFilter" style="margin-top: 10px"/>
    <div style="width:100%;height:300px" v-if="modsAfterFilter.length > 0">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2 ref="testing"
                       :columns="columns"
                       :data="modsAfterFilter"
                       :width="width"
                       :height="height"
                       :header-height="60"
                       :row-height="60"
                       :row-class="rowClass"
                       :cache="0"
          />
        </template>
      </el-auto-resizer>
    </div>
    <el-button type="primary" plain style="width: 100%;margin-top: 15px" :disabled="!enableConfirm"
               @click="validateConfig" :loading="loading">
      {{ $t(`message.common.validate_button`) }}
    </el-button>
  </div>
</template>

<script lang="jsx">
import ModFilter from "./ModFilter.vue";
import {mapGetters} from "vuex";
import Backend from '../../backend.js';
import {ElMessageBox} from "element-plus";

export default {
  name: "NewGroupDialog",
  components: {ModFilter},
  props: {
    toEdit: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  data: function () {
    return {
      //editor: ClassicEditor,
      editorConfig: {
        removePlugins: ['MediaEmbed', 'CKFinderUploadAdapter', 'CKFinder', 'EasyImage', 'Image', 'ImageCaption', 'ImageStyle', 'ImageToolbar', 'ImageUpload'],
      },
      loading: false,
      desc: this.toEdit ? this.toEdit.desc : '',
      form: {
        title: "",
        desc: ""
      },
      modsAfterFilter: [],
      checked: {},
      formValidationState: {},
      enableConfirm: false,
      rules: {
        name: [
          {required: true, message: this.$t(`message.mods.please_fill_the_field`), trigger: ['blur', 'change']},
          {
            min: 5,
            max: 255,
            message: this.$t(`message.mods.length_should_be_in_range`, {min: 5, max: 255}),
            trigger: ['blur', 'change']
          },
        ],
        desc: [
          {required: true, message: this.$t(`message.mods.please_fill_the_field`), trigger: ['blur', 'change']},
          {
            min: 20,
            max: 5000,
            message: this.$t(`message.mods.length_should_be_in_range`, {min: 20, max: 5000}),
            trigger: ['blur', 'change']
          },
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["config", "authenticatedUser"]),
    checkedCount: function () {
      return Object.keys(this.checked).filter(it => this.checked[it] === true).length;
    },
    columns: function () {
      return [
        {
          key: 'selection',
          width: 50,
          cellRenderer: ({rowData}) => {
            return <el-checkbox size="large" v-model={this.checked[rowData.id]}/>
          },
          headerCellRenderer: () => {
            const allSelected = this.modsAfterFilter.map(it => it.id).every((id) => this.checked[id] != null && this.checked[id] === true);
            const containsChecked = this.modsAfterFilter.map(it => it.id).some((id) => this.checked[id] != null && this.checked[id] === true)

            return <el-checkbox size="large" v-model={allSelected} indeterminate={containsChecked && !allSelected}
                                onChange={value => this.modsAfterFilter.map(it => it.id).forEach(it => this.checked[it] = value)}/>
          },
        },
        {
          key: 'preview',
          width: 80,
          align: 'center',
          cellRenderer: (cellData) => <div>{!cellData.rowData.isDisabled ?
              <el-badge value={this.$t(`message.common.update_label`)}
                        type="success" class="verbose-badge" hidden={!cellData.rowData.hasUpdate}>
                <el-image src={cellData.rowData.preview} lazy fit="scale-down" style="height:60px"></el-image>
              </el-badge>
              :
              <el-badge value={this.$t(`message.common.disabled_label`)} type="info" class="verbose-badge">
                <el-image src={cellData.rowData.preview} lazy fit="scale-down"></el-image>
              </el-badge>
          }</div>
        },
        {
          key: 'name',
          width: 500,
          align: 'center',
          cellRenderer: (cellData) => <el-button text type="primary" class="title"
                                                 onClick={e => this.detail(cellData.rowData)}>{cellData.rowData.name}</el-button>,

          headerCellRenderer: () => {
            return <span
                style="font-weight:400">{this.$t(`message.mods.selected_label`, {nb: this.checkedCount})}</span>
          },
        }
      ]
    },
  },
  watch: {
    checked: {
      handler: async function () {
        await this.$nextTick();
        let validation = false;
        await this.$refs.form.validate((valid) => {
          validation = valid;
        });
        this.enableConfirm = validation && this.checkedCount > 0;
      },
      deep: true
    },
    form: {
      handler: async function() {
        await this.$nextTick();
        let validation = false;
        await this.$refs.form.validate((valid) => {
          validation = valid;
        });
        this.enableConfirm = validation && this.checkedCount > 0;
      },
      deep: true
    }
  },
  methods: {
    rowClass: function (args) {
      if (args.rowData.hasUpdate) {
        return "bg-update";
      } else if (args.rowData.isDisabled) {
        return "bg-disabled";
      }
    },
    validateConfig: async function () {
      this.loading = true;
      let validation = await this.$refs.form.validate();
      if (validation) {
        let group = {
          ...this.toEdit,
          title: this.form.name,
          desc: this.form.desc,
          mods: Object.keys(this.checked)
              .filter(it => this.checked[it] === true)
              .map(id => this.config.mods.find(it => it.id === id))
              .filter(it => it != null)
              .map(it => {
                return {
                  id: it.id,
                  creator: it.creator,
                  name: it.name,
                  preview: it.preview,
                  provider: it.provider,
                  files: [...it.files.map(file => {
                    let createdFiles = file.createdFiles.map(f => {
                      // Remove disabled
                      if (f.endsWith('OFF')) {
                        f = f.substring(0, f.lastIndexOf('OFF'));
                      }
                      // Remove start
                      let path = this.config.path.replaceAll('\\', '/');
                      f = f.replaceAll('\\', '/').replace(path, "");
                      if (f.startsWith('/')) {
                        f = f.substring(1);
                      }
                      return f;
                    });

                    let files = JSON.parse(JSON.stringify(file));
                    files.createdFiles = createdFiles;
                    return files;
                  })]
                };
              })
        };

        const _this = this;
        await Backend.createOrUpdateGroup(group, this.authenticatedUser.accessToken, this.config.uniqueId)
            .then(resp => {
              _this.$emit('group-dialog-validated', resp.data);
            })
            .catch(err => {
              ElMessageBox.alert(
                  this.$t(`message.mods.group_err_dialog.desc`, {reason: err}),
                  this.$t(`message.mods.group_err_dialog.title`),
                  {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: 'OK',
                    cancelButtonText: this.$t(`message.common.cancel_button`),
                    type: 'danger',
                    draggable: true
                  }
              )
            });
      }
      this.loading = false;
    },
  },
  mounted() {
    if (this.toEdit != null) {
      this.form.name = this.toEdit.title;
      this.form.desc = this.toEdit.desc;
      this.toEdit.mods.forEach(it => this.checked[it.id] = true);
    }
  }
}
</script>

<style>
:root {
  --ck-color-base-background: var(--el-bg-color);
  --ck-color-base-text: var(--el-text-color-primary);
  --ck-color-button-default-hover-background: var(--el-color-info-light-3);
}
.ck-editor__editable {
  height: 200px;
  max-height: 200px;
}
</style>