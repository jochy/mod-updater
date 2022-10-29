<template>
  <div>
    <el-button v-if="detail" type="success" class="install-btn" :plain="installPlain"
               @click="blur($event);askQuickInstall()">
      <i class="fa-duotone fa-download icon-install-btn"></i>
      {{ $t(`message.common.quick_install_mod_button`) }}
    </el-button>
    <el-button v-else type="success" plain size="small" @click="blur($event);askQuickInstall()">
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
          <div style="height: 400px; width: 100%; margin: 20px 0">
            <el-auto-resizer>
              <template #default="{ height, width }">
                <el-table-v2 ref="testing"
                             :columns="columns"
                             :data="document.mods"
                             :width="width"
                             :height="height"
                             :header-height="0"
                             :row-height="50"
                             :cache="0"
                />
              </template>
            </el-auto-resizer>
          </div>
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

<script lang="jsx">
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
    }
  },
  data: function () {
    return {
      installPlain: false,
      scheduler: null,
      quickInstall: false,
      checked: {},
      columns: [
        {
          key: 'selection',
          width: 50,
          cellRenderer: ({rowData}) => {
            return <el-checkbox size="large" v-model={this.checked[rowData.id]}/>
          },
        },
        {
          key: 'preview',
          width: 90,
          align: 'center',
          cellRenderer: (cellData) => <el-avatar shape="square" size={50} src={cellData.rowData.preview}/>
        },
        {
          key: 'name',
          width: 500,
          align: 'left',
          cellRenderer: (cellData) => {
            const to = {name: 'detail', params: {id: cellData.rowData.id}}
            return <router-link to={to}>
              <el-button link type="primary">{cellData.rowData.name}</el-button>
            </router-link>
          },
        }
      ]
    }
  },
  methods: {
    askQuickInstall: function () {
      this.quickInstall = true;
    },
    installGroup: function ($event) {
      this.blur($event);
      let ignored = [...this.document.mods.filter(mod => this.checked[mod.id] === false).map(it => it.id)];
      let doc = {
        ...this.document,
        ignoreMods: ignored
      }
      window.ipcRenderer.send('install-group', JSON.parse(JSON.stringify(doc)));
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
    this.document.mods.forEach(mod => this.checked[mod.id] = true);
    this.scheduler = setInterval(function () {
      _this.installPlain = !_this.installPlain
    }, 1000);
  },
  unmounted() {
    clearInterval(this.scheduler);
  }
}
</script>
