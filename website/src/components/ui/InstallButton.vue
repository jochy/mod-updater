<template>
  <div>
    <el-button v-if="detail && !hidden" type="success" class="install-btn" :plain="installPlain"
               @click="blur($event);install()">
      <i class="fa-duotone fa-download icon-install-btn"></i>
      {{ $t(`message.common.install_mod_button`) }}
    </el-button>
    <el-button v-else-if="!hidden" type="success" plain size="small" @click="blur($event);askQuickInstall()">
      <template #icon>
        <i class="fa-duotone fa-download"></i>
      </template>
      {{ $t(`message.common.quick_install_mod_button`) }}
    </el-button>

    <el-dialog v-if="doc != null" v-model="askFilePicker" :title="title" width="90%" top="4vh">
      <file-picker :mod="doc" @fileSelected="installWithFile"/>
    </el-dialog>

    <el-dialog v-model="quickInstall" :title="title" width="90%" top="4vh">
      <div v-loading="loading">
        <file-picker v-if="doc != null" :mod="doc" @fileSelected="installWithFile"/>
      </div>
    </el-dialog>

    <el-dialog v-model="easterEgg" title="Inception" width="80%">
      <h4>Have you seen this movie?</h4>
      <img style="width: 500px" src="https://m.media-amazon.com/images/I/81CgNB2mglL._SL1425_.jpg"
           alt="Inception cover"/>
      <h4>It looks like you are trying to do the same <i class="em em-blush" aria-role="presentation"
                                                         aria-label="SMILING FACE WITH SMILING EYES"></i></h4>
    </el-dialog>
  </div>
</template>

<script>
import {ElMessage} from "element-plus";
import DateUtils from "../../../lib/DateUtils";
import FilePicker from "@/components/FilePicker.vue";
import Backend from "@/backend.js";

export default {
  name: "InstallButton",
  components: {
    FilePicker
  },
  props: {
    detail: {
      type: Boolean,
      default() {
        return false;
      }
    },
    document: {
      type: Object
    },
    title: {
      type: String,
      required: true
    },
    id: {
      type: String
    },
    hidden: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  watch: {
    quickInstall: function() {
      this.$emit('quick-install-changed');
    }
  },
  data: function () {
    return {
      installPlain: false,
      scheduler: null,
      doc: null,
      askFilePicker: false,
      easterEgg: false,
      quickInstall: false,
      loading: false,
    }
  },
  methods: {
    load: async function () {
      this.loading = true;
      this.doc = await Backend.getById(this.id);
      this.loading = false;
    },
    askQuickInstall: function () {
      console.log('Asked');
      if (this.id === 'modthesims_663925') {
        this.easterEgg = true;
      } else {
        this.quickInstall = true;
      }
    },
    install: function () {
      if (this.doc.id === 'modthesims_663925') {
        this.easterEgg = true;
        return;
      }
      if (this.doc.files.length === 0) {
        ElMessage({
          message: this.$t(`message.common.no_download_file_mod_cannot_be_installed`),
          type: 'error',
          showClose: true
        });
      } else if (this.doc.files.length === 1 && (this.doc.files[0].internalFiles == null || this.doc.files[0].internalFiles.length === 1)) {
        let toSend = {
          id: this.doc.id,
          name: this.doc.title,
          preview: this.doc.preview,
          creator: this.doc.creator,
          provider: this.doc.provider,
          files: [
            {
              url: this.doc.files[0].link,
              name: this.doc.files[0].name,
              version: DateUtils.dateToVersion(this.doc.files[0].date),
              internalFiles: this.doc.files[0].internalFiles,
            },
          ]
        };
        window.ipcRenderer.send('install-mod', JSON.parse(JSON.stringify(toSend)));
      } else {
        this.askFilePicker = true;
      }
    },
    installWithFile: function (selection) {
      this.askFilePicker = false;
      this.quickInstall = false;
      let toSend = {
        id: this.doc.id,
        name: this.doc.title,
        preview: this.doc.preview,
        creator: this.doc.creator,
        provider: this.doc.provider,
        files: selection.map(item => {
          let checked = undefined;
          if (item.checked != null) {
            checked = [...item.checked];
          }
          let internalFiles = undefined;
          if (item.internalFiles != null) {
            internalFiles = [...item.internalFiles];
          }
          return {
            url: item.link,
            name: item.name,
            version: DateUtils.dateToVersion(item.date),
            checked: checked,
            internalFiles: internalFiles
          }
        })
      };
      window.ipcRenderer.send('install-mod', JSON.parse(JSON.stringify(toSend)));
    },
    blur: function (el) {
      if (el.target.tagName !== 'BUTTON' && el.target.parentElement.tagName === 'BUTTON') {
        el.target.parentElement.blur();
      } else {
        el.target.blur();
      }
    },
  },
  mounted() {
    if (this.document != null) {
      this.doc = this.document;
    } else {
      this.load();
    }
    const _this = this;
    this.scheduler = setInterval(function () {
      _this.installPlain = !_this.installPlain
    }, 1000);
  },
  unmounted() {
    clearInterval(this.scheduler);
  }
}
</script>
