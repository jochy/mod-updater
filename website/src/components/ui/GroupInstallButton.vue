<template>
  <div>
    <el-button v-if="detail && !hidden" type="success" class="install-btn" :plain="installPlain"
               @click="blur($event);askQuickInstall()">
      <i class="fa-duotone fa-download icon-install-btn"></i>
      {{ $t(`message.common.quick_install_mod_button`) }}
    </el-button>
    <el-button v-else-if="!hidden" type="success" plain size="small" @click="blur($event);askQuickInstall()">
      <template #icon>
        <i class="fa-duotone fa-download"></i>
      </template>
      {{ $t(`message.common.quick_install_mod_button`) }}
    </el-button>

    <div v-if="document != null">
      <el-dialog v-model="quickInstall" :title="document.title" width="90%" top="4vh">
        <ads type="leaderboard"/>
        <div style="text-align: left !important; margin-top: 20px">
          {{ $t(`message.common.group_confirm_install`) }}
          <ul>
            <li v-for="mod in document.mods">{{ mod.name }}</li>
          </ul>
        </div>
        <el-button-group>
          <el-button @click="() => this.quickInstall = false">{{ $t(`message.common.cancel_button`) }}</el-button>
          <el-button type="primary" @click="$event => this.installGroup($event)">
            {{ $t(`message.common.quick_install_mod_button`) }}
          </el-button>
        </el-button-group>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Backend from "@/backend.js";
import Ads from "@/components/google/Ads.vue";
import {ElMessage} from "element-plus";

export default {
  name: "GroupInstallButton",
  components: {Ads},
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
    hidden: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data: function () {
    return {
      installPlain: false,
      scheduler: null,
      quickInstall: false,
    }
  },
  watch: {
    quickInstall: function() {
      this.$emit('quick-install-changed');
    }
  },
  methods: {
    askQuickInstall: function () {
      this.quickInstall = true;
    },
    installGroup: function ($event) {
      this.blur($event);
      window.ipcRenderer.send('install-group', JSON.parse(JSON.stringify(this.document)));
      ElMessage({
        message: this.$t(`message.common.group_installed`),
        type: 'success',
      });
      this.quickInstall = false;
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
