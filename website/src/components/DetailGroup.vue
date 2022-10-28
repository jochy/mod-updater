<template>
  <div v-loading="isLoading" style="display: flex">
    <div style="margin-right: 10px; flex-grow: 1">
      <div v-if="document != null">
        <div v-if="isApp">
          <el-popconfirm v-if="getInstalledGroup.find(it => it.id === document.id) != null"
                         width="300"
                         :title="$t(`message.common.are_you_sure_do_you_cant_to_remove_this_mod_group`)"
                         @confirm="removeGroup(document.id)">
            <template #reference>
              <el-button type="danger" class="install-btn" :plain="installPlain">
                <template #icon>
                  <i class="fa-duotone fa-trash-can"></i>
                </template>
                {{ $t(`message.common.remove_label`) }}
              </el-button>
            </template>
          </el-popconfirm>
          <group-install-button v-else :detail="true" :document="document"/>
        </div>

        <h1 style="font-size: 24px; padding:0">{{ document.title }}</h1>
        <div style="max-width: 420px;text-align: center;display: inline-block">
          <avater-grid :content="document.mods.map(it => { return {img: it.preview, tooltip: it.name}})" :cols="6"/>
        </div>
        <el-row>
          <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18" style="text-align: left">
            <el-tabs>
              <el-tab-pane :label="$t(`message.common.description_label`)">
                <div style="float:right;margin: 5px">
                  <el-button v-if="$i18n.locale !== 'en' && !isTranslating && translated == null" :plain="true"
                             @click="translate">
                    {{ $t(`message.common.translate_button`) }}
                  </el-button>
                  <el-button v-if="isTranslating" :loading="true" :plain="true"></el-button>
                </div>
                <p v-html="document.desc" style="color: var(--el-text-color-primary)" class="detail-desc"></p>
              </el-tab-pane>
              <el-tab-pane :label="$t(`message.common.group_mods_tab_label`)">
                <div style="width: 100%;height: 400px">
                  <el-auto-resizer>
                    <template #default="{ height, width }">
                      <el-table-v2
                          :columns="columns"
                          :data="document.mods"
                          :width="width"
                          :height="height"
                          :header-height="0"
                          :row-height="80"
                          :cache="0"
                      />
                    </template>
                  </el-auto-resizer>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" style="text-align: left">
            <el-tabs style="margin-left: 20px">
              <el-tab-pane :label="$t(`message.common.info_label`)">
                <el-descriptions :column="1">
                  <el-descriptions-item :label="$t(`message.common.creator_label`)" label-class-name="key">
                    {{ document.creatorPseudo }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.created_label`)" label-class-name="key">{{
                      date2string(new Date(document.date))
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.updated_label`)" v-if="document.updated !== null"
                                        label-class-name="key">
                    {{ date2string(new Date(document.updated)) }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.mods_included`)" label-class-name="key">
                    {{ document.mods.length }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.tags_label`)"
                                        v-if="document.tags != null && document.tags.length > 0"
                                        label-class-name="key">
                    <el-space wrap size="small">
                      <el-tag v-for="item in document.tags" :key="item" size="small">{{ item }}</el-tag>
                    </el-space>
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </div>
    </div>

    <div id="detail-buffer" style="display: none"></div>
  </div>
</template>

<script lang="jsx">
import Backend from '../backend.js';
import {mapGetters} from 'vuex';
import DateUtils from "../../lib/DateUtils.js";
import AvaterGrid from "./ui/AvatarGrid.vue";
import GroupInstallButton from "./ui/GroupInstallButton.vue";
import {ElMessage} from "element-plus";

export default {
  name: "DetailGroup",
  components: {
    AvaterGrid: AvaterGrid, GroupInstallButton
  },
  data: function () {
    return {
      id: this.$route.params.id,
      isLoading: true,
      document: null,
      installPlain: false,
      scheduler: null,
      isTranslating: false,
      translated: null
    }
  },
  computed: {
    ...mapGetters(['isApp', 'config', 'getInstalledGroup']),
    columns: function () {
      return [
        {
          key: 'preview',
          width: 100,
          align: 'center',
          cellRenderer: (cellData) => <el-image src={cellData.rowData.preview} fit="scale-down"></el-image>
        },
        {
          key: 'name',
          width: 800,
          align: 'center',
          cellRenderer: (cellData) => <el-button text type="primary" class="title" onClick={() => this.$router.push({
            name: 'detail',
            params: {id: cellData.rowData.id}
          })}>{cellData.rowData.name}</el-button>,
        }
      ]
    }
  },
  methods: {
    blur: function (el) {
      if (el.target.tagName !== 'BUTTON' && el.target.parentElement.tagName === 'BUTTON') {
        el.target.parentElement.blur();
      } else {
        el.target.blur();
      }
    },
    translate: async function () {
      this.isTranslating = true;
      let t = await Backend.translate(this.document.desc, this.$i18n.locale);
      this.translated = t.data.translatedText;
      this.lintDesc(this.translated);
      this.isTranslating = false;
    },
    date2string: function (date) {
      return DateUtils.dateToString(date);
    },
    removeGroup: function(gid) {
      window.ipcRenderer.send('group-removed', {id: gid});
      ElMessage({
        message: this.$t(`message.common.group_uninstalled`),
        type: 'success',
      });
    },
    lintDesc: function (text) {
      document.getElementById("detail-buffer").innerHTML = text;
      document.getElementById("detail-buffer").querySelectorAll("a").forEach(a => {
        a.setAttribute("target", "_blank");
        a.href = "javascript:void(0)";
        a.style.pointerEvents = 'none';
        a.style.borderBottom = 'none';
        a.style.color = 'var(--el-color-primary)';
      });
      this.document.desc = document.getElementById("detail-buffer").innerHTML;
    }
  },
  async mounted() {
    this.document = await Backend.getById(this.id);
    window.updateTitleAndDescription(this.document.title, this.document.desc);
    window.sendGtagEvent("detailGroup", {mod: this.document.title, id: this.document.id});
    this.lintDesc(this.document.desc);
    this.isLoading = false;
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

<style>

</style>