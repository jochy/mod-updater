<template>
  <div v-loading="isLoading" style="display: flex">
    <div style="margin-right: 10px; flex-grow: 1">
      <div v-if="document != null">
        <div v-if="isApp">
          <install-button v-if="!checkInstalled && !isInstalling" :detail="true" :document="document"
                          :title="document.title"/>
          <el-button v-if="checkInstalled && !isInstalling" type="danger" class="install-btn" :plain="installPlain"
                     @click="remove">
            <i class="fa-duotone fa-trash-can icon-install-btn"></i>
            {{ $t(`message.common.remove_mod_button`) }}
          </el-button>
          <el-button v-if="isInstalling" type="info" class="install-btn" :loading="true"/>
        </div>
        <div v-else>
          <install-with-app-button :document="document" :detail="true" class="install-btn"/>
        </div>
        <h1 style="font-size: 24px; padding:0">{{ document.title }}</h1>
        <el-carousel :autoplay="false" arrow="always" type="card" v-if="document != null" height="300px"
                     style="width: 100%">
          <div v-for="(item, index) in document.screenshots" :key="item">
            <el-carousel-item>
              <img v-lazy="{src: item}" @click="imgToShow = item; dialogVisible = true" class="preview"/>
            </el-carousel-item>
            <el-carousel-item v-if="index === document.screenshots.length - 1">
              <ads type="sized"/>
            </el-carousel-item>
          </div>
        </el-carousel>
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
                <p v-if="document.provider === 'Modder\'s website' || document.provider === 'patreon'">
                  <el-alert type="success" show-icon>
                    <span v-html="$t(`message.details.shout_out_to_modders`, {
                        creator: document.creator,
                        url: document.url,
                        type: document.provider === 'patreon' ? 'patreon' : $t(`message.common.website`)
                      })"/>
                  </el-alert>
                </p>

                <p v-html="document.desc" style="color: var(--el-text-color-primary)" class="detail-desc"></p>

                <p v-if="document.provider === 'thesimsresource'" style="font-size: 12px; text-align: center"><i>(c)
                  1999 - 2009, The Sims Resource. All rights reserved.</i></p>
              </el-tab-pane>
              <el-tab-pane :label="$t(`message.common.files_label`)">
                <el-table :data="document.files" style="width: 100%"
                          v-if="document.files != null && document.files.length > 0">
                  <el-table-column prop="name" :label="$t(`message.common.name_label`)" label-class-name="downloaded"/>
                  <el-table-column prop="size" :label="$t(`message.common.size_label`)" label-class-name="downloaded"
                                   width="85px"
                                   class-name="downloaded"/>
                  <el-table-column prop="downloads" :label="$t(`message.common.downloads_label`)"
                                   label-class-name="downloaded" width="90px"
                                   class-name="downloaded"/>
                  <el-table-column prop="date" :label="$t(`message.common.date_label`)" label-class-name="downloaded"
                                   width="110px"
                                   class-name="downloaded">
                    <template #default="scope">
                      {{ date2string(scope.row.date) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane :label="$t(`message.details.suggestions_label`)">
                <el-skeleton style="width: 240px" :loading="suggestions == null" animated>
                  <template #template>
                    <el-space direction="horizontal">
                      <div style="display: inline-block" v-for="o in 5" :key="o">
                        <el-skeleton-item variant="image" style="width: 200px; height: 200px"/>
                        <div style="padding: 14px">
                          <el-skeleton-item variant="h3" style="width: 50%"/>
                        </div>
                      </div>
                    </el-space>
                  </template>
                  <template #default>
                    <div v-if="suggestions.length === 0" style="color: var(--el-text-color-primary)">
                      {{ $t(`message.details.no_suggestions_yet`) }}
                    </div>
                    <el-space v-else wrap>
                      <el-card :body-style="{ padding: '0px', width: '200px', height: '300px', 'text-align': 'center' }"
                               v-for="s in suggestions.suggestions" :key="s">
                        <img v-lazy="{src: s.document.preview}" class="suggestion-img"/>
                        <div style="padding: 14px">
                          <router-link :to="{ name: 'detail', params: { id: s.document.id }}">
                            <el-link type="primary" :underline="false">{{ s.document.title }}</el-link>
                          </router-link>
                        </div>
                      </el-card>
                    </el-space>
                  </template>
                </el-skeleton>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6" style="text-align: left">
            <el-tabs style="margin-left: 20px">
              <el-tab-pane :label="$t(`message.common.info_label`)">
                <el-descriptions :column="1">
                  <el-descriptions-item :label="$t(`message.common.provider_label`)" label-class-name="key">
                    <el-link :href="document.url" target="_blank" type="primary">{{ document.provider }}</el-link>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.creator_label`)" label-class-name="key">
                    {{ document.creator }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.created_label`)" label-class-name="key">{{
                      date2string(new Date(document.date))
                    }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.updated_label`)" v-if="document.updated !== null"
                                        label-class-name="key">
                    {{ date2string(new Date(document.updated)) }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.downloads_label`)" v-if="document.files.length > 0"
                                        label-class-name="key">
                    {{ document.downloaded }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.installations_label`)"
                                        v-if="suggestions?.installed > 0" label-class-name="key">
                    {{ suggestions?.installed }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.marked_outdated_label`)"
                                        v-if="suggestions?.outdated != null"
                                        label-class-name="key">
                    {{ suggestions.outdated }}
                    <el-tooltip :content="helpMarkedOutdated" placement="bottom" raw-content>
                      <el-link :underline="false" style="top: -1px; vertical-align: sub; margin-left: 5px">
                        <i class="material-icons" style="font-size: 16px">help_outline</i>
                      </el-link>
                    </el-tooltip>
                    <el-button v-if="isApp && !suggestions.userOutdated && !isMarkingMod" type="danger" :plain="true"
                               size="small"
                               style="float: right; margin-right: 10px" @click="blur($event);markOutdated()">
                      {{ $t(`message.details.mark_as_outdated`) }}
                    </el-button>
                    <el-button v-if="isApp && suggestions.userOutdated && !isMarkingMod" type="success" :plain="true"
                               size="small"
                               style="float: right; margin-right: 10px" @click="blur($event);markUpdated()">
                      {{ $t(`message.details.unmark_as_outdated`) }}
                    </el-button>
                    <el-button v-if="isApp && isMarkingMod" :loading="true" :plain="true" size="small"
                               style="float: right; margin-right: 10px">
                    </el-button>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.required_label`)"
                                        v-if="document.required != null && document.required.length > 0"
                                        label-class-name="key">
                    <el-space wrap size="small">
                      <el-tag type="success" v-for="item in document.required" :key="item" size="small">{{
                          item
                        }}
                      </el-tag>
                    </el-space>
                  </el-descriptions-item>
                  <el-descriptions-item :label="$t(`message.common.tags_label`)"
                                        v-if="document.tags != null && document.tags.length > 0"
                                        label-class-name="key">
                    <el-space wrap size="small">
                      <el-tag v-for="item in document.tags" :key="item" size="small">{{ item }}</el-tag>
                    </el-space>
                  </el-descriptions-item>
                  <el-descriptions-item v-if="!isApp" label-class-name="key">
                    <copy-install-link-button :document="document"/>
                  </el-descriptions-item>
                </el-descriptions>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>

        <el-dialog v-model="dialogVisible" top="5vh" width="80%">
          <ads type="leaderboard"/>
          <img :src="imgToShow" style="width: auto; height: auto; max-width: 100%; max-height: 100%"/>
          <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">{{ $t(`message.common.close_button`) }}</el-button>
      </span>
          </template>
        </el-dialog>
      </div>
    </div>

    <div id="detail-buffer" style="display: none"></div>
  </div>
</template>

<script>
import Backend from '../backend.js';
import {mapGetters} from 'vuex';
import DateUtils from "../../lib/DateUtils.js";
import Ads from "@/components/google/Ads.vue";
import InstallButton from "@/components/ui/InstallButton.vue";
import {ElMessageBox} from "element-plus";
import InstallWithAppButton from "./ui/InstallWithAppButton.vue";
import CopyInstallLinkButton from "./ui/CopyInstallLinkButton.vue";

export default {
  name: "Detail",
  components: {
    InstallButton,
    Ads,
    InstallWithAppButton,
    CopyInstallLinkButton
  },
  data: function () {
    return {
      id: this.$route.params.id,
      isLoading: true,
      document: null,
      dialogVisible: false,
      imgToShow: null,
      installPlain: false,
      scheduler: null,
      suggestions: null,
      helpMarkedOutdated: `<span style="font-size:20px">The number of users who find this mod outdated</span>`,
      isMarkingMod: false,
      isTranslating: false,
      translated: null
    }
  },
  computed: {
    ...mapGetters(['isApp', 'config']),
    downloads: function () {
      let downloads = 0;
      this.document.files.forEach(item => downloads += item.downloads);
      if (isNaN(downloads)) {
        downloads = 0;
      }
      return downloads;
    },
    checkInstalled: function () {
      return this.$store.getters.isInstalled(this.document.id);
    },
    isInstalling: function () {
      return this.$store.getters.isInstalling(this.document.id);
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
    markOutdated: function () {
      const _this = this;
      ElMessageBox.confirm(
          this.$t(`message.details.mark_mod_as_outdated_popup_desc`),
          this.$t(`message.details.mark_mod_as_outdated_popup_title`), {
            confirmButtonText: this.$t(`message.details.mark_mod_as_outdated_popup_confirm_button`),
            confirmButtonClass: "el-button--danger",
            cancelButtonText: this.$t(`message.common.cancel_button`),
            dangerouslyUseHTMLString: true,
          })
          .then(async () => {
            _this.isMarkingMod = true;
            _this.suggestions = await Backend.markModAsOutdated(_this.id, _this.config.uniqueId);
            await new Promise(resolve => setTimeout(resolve, 1000));
            _this.isMarkingMod = false;
          })
          .catch(() => {
            _this.isMarkingMod = false;
            console.log("Mark cancelled")
          });
    },
    markUpdated: async function () {
      this.isMarkingMod = true;
      this.suggestions = await Backend.unmarkModAsOutdated(this.id, this.config.uniqueId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isMarkingMod = false;
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
    remove: function () {
      window.ipcRenderer.send('remove-mod', {
        id: this.document.id,
        name: this.document.title
      });
    },
    lintDesc: function (text) {
      document.getElementById("detail-buffer").innerHTML = text;
      document.getElementById("detail-buffer").querySelectorAll("a").forEach(a => {
        a.setAttribute("target", "_blank");
        const href = a.getAttribute("href");
        if (href != null && href !== "#" && !href.startsWith("http") && !href.startsWith("//")) {
          if (this.document.provider === "modthesims") {
            a.href = "https://modthesims.info" + href;
          } else if (this.document.provider === "thesimsresource") {
            a.href = "https://www.thesimsresource.com" + href;
          } else {
            a.href = this.document.url;
          }
          a.setAttribute('target', '_blank');
        } else if (href === "#") {
          a.href = "javascript:void(0)";
          a.style.pointerEvents = 'none';
          a.style.borderBottom = 'none';
        }
        a.style.color = 'var(--el-color-primary)';
      });
      this.document.desc = document.getElementById("detail-buffer").innerHTML;
    }
  },
  async mounted() {
    Backend.suggestions(this.id, this.config != null ? this.config.uniqueId : null)
        .then(suggestions => _this.suggestions = suggestions);
    this.document = await Backend.getById(this.id);
    window.updateTitleAndDescription(this.document.title, this.document.desc);
    window.sendGtagEvent("detail", {mod: this.document.title, id: this.document.id});
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
.preview {
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  line-height: 300px;
}

.el-descriptions__body {
  background-color: transparent !important;
}

.key {
  font-weight: bold;
}

.spoiler.content {
  display: block !important;
}

.suggestion-img {
  width: 200px;
  height: 200px;
}

.spoiler {
  border: 2px dashed var(--el-border-color-base);
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.spoiler > input {
  color: var(--el-color-warning);
  border-color: transparent;
  background-color: transparent;
  cursor: pointer;
}

.downloaded {
  font-size: 12px;
}

.el-table {
  background-color: transparent !important;
}

.el-table tr {
  background-color: transparent !important;
}

.el-table__cell {
  background-color: transparent !important;
}

.detail-header {
  position: absolute;
  top: 0;
  z-index: 30;
}

.install-btn {
  position: absolute !important;
  top: 20px;
  right: 30px;
  z-index: 30;
}

.icon-install-btn {
  margin-right: 10px;
  margin-left: 0;
}

@media screen and (max-width: 670px) {
  .hide-less-670 {
    display: none;
  }
}

.detail-desc img {
  max-width: 100%;
}
</style>