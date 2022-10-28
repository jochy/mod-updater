<template>
  <div>
    <el-row v-if="configInvalid">
      <el-alert :title="$t(`message.config.invalid_config`)" type="error" :closable="false" center show-icon
                style="margin-bottom: 5px">
        {{ $t(`message.config.folder_not_found`) }}
      </el-alert>
    </el-row>
    <el-row>
      <el-form style="width: 100%; text-align: left" label-width="300px" label-position="right"
               :model="dynamicValidateForm" ref="form"
               @validate="formValidation">
        <el-form-item :label="$t(`message.config.mods_folder`)" prop="file"
                      :rules="[{ required: true, message: $t(`message.config.please_select_a_folder`), trigger: ['blur', 'change']}]">
          <el-input size="large" v-model="dynamicValidateForm.file" :placeholder="$t(`message.config.mods_folder`)"
                    readonly>
            <template #append>
              <el-button size="large" type="primary" @click="askFile('mods')">
                {{ $t(`message.config.select_folder_button`) }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t(`message.config.tray_folder`)" prop="trayFolder"
                      :rules="[{ required: true, message: $t(`message.config.please_select_a_folder`), trigger: ['blur', 'change']}]">
          <el-input size="large" v-model="dynamicValidateForm.trayFolder"
                    :placeholder="$t(`message.config.tray_folder`)" readonly>
            <template #append>
              <el-button type="primary" size="large" @click="askFile('tray')">
                {{ $t(`message.config.select_folder_button`) }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t(`message.config.enable_versioning`)">
          <el-switch v-model="enableVersioning"/>
          <el-link :underline="false" @click="displayVersioningPopupHelp"
                   style="top: 3px; vertical-align: sub; margin-left: 30px">
            <i class="material-icons">help_outline</i>
          </el-link>
        </el-form-item>
        <el-form-item :label="$t(`message.config.new_folder_pattern`)" prop="newFolderPattern"
                      :rules="[{ required: true, message: $t(`message.config.please_fill_the_input`), trigger: ['blur', 'change']}]">
          <el-input size="large" v-model="dynamicValidateForm.newFolderPattern"
                    :placeholder="$t(`message.config.new_folder_pattern_placeholder`)"/>
          <p style="color:var(--el-text-color-primary)">
            <b>{{ $t(`message.config.new_folder_pattern_desc.available_placeholders_title`) }}</b>: {title}, {creator},
            {id}, {provider}<br/>
            <b>{{ $t(`message.config.new_folder_pattern_desc.example_with_your_current_pattern`) }}</b>: {{
              testPattern
            }}
          </p>
          <el-link :underline="false" @click="newPatternHelp" style="top: 3px; vertical-align: sub; margin-left: 30px">
            <i class="material-icons">help_outline</i>
          </el-link>
        </el-form-item>
        <el-form-item :label="$t(`message.config.check_update_interval`)">
          <el-input-number size="large" v-model="updateCheckInterval" :min="1" :max="48"/>
          <span style="margin-left: 5px;color:var(--el-text-color-primary)"> {{ $t(`message.config.hours`) }}</span>
        </el-form-item>
        <el-form-item :label="$t(`message.config.display_update_popup`)">
          <el-switch v-model="displayUpdatePopup"/>
          <el-link :underline="false" @click="displayUpdatePopupHelp"
                   style="top: 3px; vertical-align: sub; margin-left: 30px">
            <i class="material-icons">help_outline</i>
          </el-link>
        </el-form-item>
        <el-form-item :label="$t(`message.config.update_mods_in_their_previous_folder`)">
          <el-switch v-model="updateModInPreviousFolder"/>
          <el-link :underline="false" @click="displayUpdateModInPreviousFolderPopupHelp"
                   style="top: 3px; vertical-align: sub; margin-left: 30px">
            <i class="material-icons">help_outline</i>
          </el-link>
        </el-form-item>
        <el-form-item
            :label="$t(`message.config.buy_me_a_coffee_email`)"
            prop="bmcMail"
            :rules="[
        {
          type: 'email',
          message: $t(`message.config.please_input_a_correct_email`),
          trigger: ['blur', 'change'],
        },
      ]"
        >
          <el-input v-model="dynamicValidateForm.bmcMail" size="large"
                    :placeholder="$t(`message.config.buy_me_a_coffee_email_placeholder`)"></el-input>
        </el-form-item>
        <el-form-item :label="$t(`message.config.disable_hardware_acceleration`)">
          <el-switch v-model="disableHardwareAcceleration"/>
          <el-link :underline="false" @click="hardwareAccelerationHelp"
                   style="top: 3px; vertical-align: sub; margin-left: 30px">
            <i class="material-icons">help_outline</i>
          </el-link>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row style="margin-top: 20px" justify="end">
      <el-button type="primary" size="large" @click="validateConfig" class="btn-block" :disabled="!enableConfirm">
        {{ $t(`message.common.validate_button`) }}
      </el-button>
    </el-row>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Config",
  props: {
    proposal: {
      type: String,
      required: false
    },
    proposalExists: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    },
    proposalTray: {
      type: String,
      required: false
    },
    proposalTrayExists: {
      type: Boolean,
      required: false,
      default() {
        return false;
      }
    }
  },
  data: function () {
    return {
      enableConfirm: true,
      updateCheckInterval: 24,
      configInvalid: false,
      dynamicValidateForm: {
        file: null,
        trayFolder: null,
        bmcMail: null,
        newFolderPattern: null,
      },
      formValidationState: {},
      askingFolder: null,
      displayUpdatePopup: true,
      disableHardwareAcceleration: false,
      updateModInPreviousFolder: false,
      enableVersioning: false,
      hasLoaded: false
    }
  },
  watch: {
    enableVersioning: function (val) {
      if (val && this.hasLoaded) {
        ElMessageBox.alert(this.$t(`message.config.versioning_warning.desc`),
            this.$t(`message.config.versioning_warning.title`), {
              confirmButtonText: this.$t(`message.common.ok_button`),
              type: 'info',
            });
      }
    }
  },
  computed: {
    ...mapGetters(['config']),
    testPattern: function () {
      if (this.dynamicValidateForm.newFolderPattern == null) {
        return '';
      }
      return this.dynamicValidateForm.newFolderPattern
          .replaceAll('{creator}', 'Joch')
          .replaceAll('{title}', 'Sims mods updater')
          .replaceAll('{id}', 'mts_007')
          .replaceAll('{provider}', 'ModTheSims')
          .replace(/[^a-zA-Z0-9 _\-[\]]/g, "");
    }
  },
  methods: {
    ...mapMutations(['incrementAskLoading']),
    displayVersioningPopupHelp: function () {
      ElMessageBox.alert(this.$t(`message.config.versioning_help.desc`),
          this.$t(`message.config.versioning_help.title`), {
            confirmButtonText: this.$t(`message.common.ok_button`),
            type: 'info',
          });
    },
    displayUpdatePopupHelp: function () {
      ElMessageBox.alert(this.$t(`message.config.display_update_help.desc`),
          this.$t(`message.config.display_update_help.title`), {
            confirmButtonText: this.$t(`message.common.ok_button`),
            type: 'info',
          });
    },
    displayUpdateModInPreviousFolderPopupHelp: function () {
      ElMessageBox.alert(this.$t(`message.config.update_mods_in_their_previous_folder_help.desc`),
          this.$t(`message.config.update_mods_in_their_previous_folder_help.title`), {
            confirmButtonText: this.$t(`message.common.ok_button`),
            type: 'info',
          });
    },
    hardwareAccelerationHelp: function () {
      ElMessageBox.alert(this.$t(`message.config.hardware_acceleration_help.desc`),
          this.$t(`message.config.hardware_acceleration_help.title`), {
            confirmButtonText: this.$t(`message.common.ok_button`),
            type: 'info',
          });
    },
    newPatternHelp: function () {
      ElMessageBox.alert(this.$t(`message.config.new_folder_pattern_help.desc`),
          this.$t(`message.config.new_folder_pattern_help.title`), {
            confirmButtonText: this.$t(`message.common.ok_button`),
            type: 'info',
          });
    },
    formValidation: function (name, error) {
      this.formValidationState.name = error;
      let valid = true;
      for (let key of Object.keys(this.formValidationState)) {
        valid &= this.formValidationState[key];
      }
      this.enableConfirm = valid;
    },
    askFile: function (file) {
      this.askingFolder = file;
      window.ipcRenderer.send('ask-file');
    },
    fileSelected: function (msg) {
      if (msg != null) {
        if (this.askingFolder === 'mods') {
          this.dynamicValidateForm.file = msg;
        } else if (this.askingFolder === 'tray') {
          this.dynamicValidateForm.trayFolder = msg;
        }
      }
    },
    validateConfig: async function () {
      let validation = await this.$refs.form.validate();
      if (validation) {
        window.ipcRenderer.send('check-config', {
          path: this.dynamicValidateForm.file,
          trayFolder: this.dynamicValidateForm.trayFolder,
          enableVersioning: this.enableVersioning
        });
      }
    },
    configCheck: function (msg) {
      this.configInvalid = !msg.isValid;
      if (msg.isValid) {
        this.configInvalid = false;
        window.ipcRenderer.send('save-config', {
          path: this.dynamicValidateForm.file,
          trayFolder: this.dynamicValidateForm.trayFolder,
          updateCheckInterval: parseInt(this.updateCheckInterval || "24"),
          displayUpdatePopup: this.displayUpdatePopup,
          updateModInPreviousFolder: this.updateModInPreviousFolder,
          bmcSubscription: this.dynamicValidateForm.bmcMail,
          disableHardwareAcceleration: this.disableHardwareAcceleration,
          newFolderPattern: this.dynamicValidateForm.newFolderPattern,
          enableVersioning: this.enableVersioning,
        });
        ElMessage({
          message: 'Config saved',
          type: 'success',
        });
        if (this.config != null && this.config.newFolderPattern != null && this.config.newFolderPattern !== this.dynamicValidateForm.newFolderPattern) {
          ElMessageBox.confirm(
              this.$t(`message.config.new_folder_pattern_modified_popup.desc`),
              this.$t(`message.config.new_folder_pattern_modified_popup.desc`), {
                confirmButtonText: this.$t(`message.config.new_folder_pattern_modified_popup.confirm_button`),
                confirmButtonClass: "el-button--primary",
                cancelButtonText: this.$t(`message.config.new_folder_pattern_modified_popup.cancel_button`),
                type: 'primary',
                dangerouslyUseHTMLString: true,
              })
              .then(() => {
                window.ipcRenderer.send('ask-sort-mods');
                this.incrementAskLoading();
              })
              .catch(() => console.log("Not renaming folders name"));
        }
      }
    }
  },
  mounted() {
    window.ipcRenderer.on('file-selected', (event, msg) => this.fileSelected(msg));
    window.ipcRenderer.on('config-check-result', (event, msg) => this.configCheck(msg));
    if (this.config) {
      this.dynamicValidateForm.file = this.config.path;
      this.dynamicValidateForm.trayFolder = this.config.trayFolder;
      this.updateCheckInterval = this.config.updateCheckInterval || 24;
      this.displayUpdatePopup = this.config.displayUpdatePopup != null ? this.config.displayUpdatePopup : true;
      this.updateModInPreviousFolder = this.config.updateModInPreviousFolder != null ? this.config.updateModInPreviousFolder : false;
      this.dynamicValidateForm.bmcMail = this.config.bmcSubscription;
      this.disableHardwareAcceleration = this.config.disableHardwareAcceleration != null ? this.config.disableHardwareAcceleration : false;
      this.enableVersioning = this.config.enableVersioning != null ? this.config.enableVersioning : false;
      this.dynamicValidateForm.newFolderPattern = this.config.newFolderPattern || '[{creator}] - {title}';
    } else {
      if (this.proposalExists) {
        this.dynamicValidateForm.file = this.proposal;
      }
      if (this.proposalTrayExists) {
        this.dynamicValidateForm.trayFolder = this.proposalTray;
      }
      this.dynamicValidateForm.newFolderPattern = '[{creator}] - {title}';
    }
    const _this = this;
    this.$nextTick().then(() => _this.hasLoaded = true);

  },
  unmounted() {
    window.ipcRenderer.removeAllListeners('file-selected');
    window.ipcRenderer.removeAllListeners('config-check-result');
  }
}
</script>

<style scoped>
.btn-block {
  width: 100%;
}
</style>