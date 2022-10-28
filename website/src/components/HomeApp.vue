<template>
  <div class="home-container" style="width: 100%">
    <el-space direction="vertical" :size="25" :fill="true">
      <el-row :gutter="5">
        <el-col :span="12" style="width: 100%">
          <el-card shadow="always" style="width: 100%">
            <div style="text-align: left; font-size: 14px">
              <changelog/>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="always">
            <h2>{{ $t(`message.app.facts_label`) }}</h2>
            <el-descriptions
                class="margin-top"
                :title="$t(`message.app.about_your_installation_title`)"
                :column="1"
                size="small"
                border
            >
              <el-descriptions-item :label="$t(`message.app.installed_mods`)">
                {{ config?.mods?.length != null ? config?.mods?.length : '?' }}
              </el-descriptions-item>
              <el-descriptions-item :label="$t(`message.app.enabled_mods`)">
                {{ config?.mods != null ? config.mods.filter(i => !i.isDisabled).length : '?' }}
              </el-descriptions-item>
              <el-descriptions-item :label="$t(`message.app.disabled_mods`)">
                {{ config?.mods != null ? config.mods.filter(i => i.isDisabled).length : '?' }}
              </el-descriptions-item>
              <el-descriptions-item :label="$t(`message.app.available_updates`)">{{
                  updates.length
                }}
              </el-descriptions-item>
              <el-descriptions-item :label="$t(`message.app.issues_found`)">{{ issues.length }}</el-descriptions-item>
            </el-descriptions>
            <el-divider/>
            <div v-if="facts == null" style="text-align: left">
              <div class="el-descriptions__title">{{ $t(`message.app.about_sims_mods_updater`) }}</div>
              <br/>
              <el-skeleton :rows="3" animated/>
            </div>
            <div v-else>
              <el-descriptions
                  class="margin-top"
                  :title="$t(`message.app.about_sims_mods_updater`)"
                  :column="1"
                  size="small"
                  border
              >
                <el-descriptions-item :label="$t(`message.app.app_version_label`)" v-if="applicationManifest != null">
                  {{ applicationManifest.version }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t(`message.app.indexed_mods`)">{{ facts.count }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t(`message.app.installed_mods_using_smu`)">
                  {{ facts.installed }}
                </el-descriptions-item>
                <el-descriptions-item :label="$t(`message.app.updated_mods_using_smu`)">
                  {{ facts.updated }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
            <el-divider/>
            <p style="line-height: 42px">
              {{ $t(`message.app.do_not_forget_to_join_our`) }}
              <el-button type="primary" plain class="discord-btn">
                <a href="https://discord.gg/ZDjc2C4Vfv" target="_blank">
                  <img src="https://statics.sims-mods-updater.com/img/discord.png" style="width: 24px"/>
                </a>
              </el-button>
              {{ $t(`message.app.and_follow_us_on`) }}
              <el-button type="primary" plain class="discord-btn">
                <a href="https://buymeacoffee.com/joch" target="_blank" style="font-size: 24px">
                  ☕
                </a>
              </el-button>
              {{ $t(`message.app.and`) }}
              <el-button type="primary" plain class="discord-btn">
                <a href="https://twitter.com/SimsModsUpdater" target="_blank" style="font-size: 24px">
                  <img src="https://statics.sims-mods-updater.com/img/twitter_logo.svg" style="width: 24px"/>
                </a>
              </el-button>
            </p>
          </el-card>
        </el-col>
      </el-row>
      <last-mods type="downloaded" @loaded="onResize"/>
      <ads style="width: 100%;"/>
      <last-mods type="updated" @loaded="onResize"/>
      <ads style="width: 100%;"/>
    </el-space>
  </div>
</template>

<script>
import Backend from "@/backend.js";
import LastMods from "./LastMods.vue";
import {mapGetters} from 'vuex';
import Ads from "@/components/google/Ads.vue";
import Changelog20500 from "@/components/changelog/Changelog20500.vue";

export default {
  name: "HomeApp",
  components: {Changelog: Changelog20500, LastMods, Ads},
  data: function () {
    return {windowHeight: window.innerHeight - 65 - 100, facts: null}
  },
  computed: {
    ...mapGetters(['config', 'updates', 'applicationManifest', 'issues']),
  },
  methods: {
    onResize: function () {
      this.windowHeight = window.innerHeight - 65;
      if (!this.isApp) {
        this.windowHeight -= 100;
      }
    }
  },
  async mounted() {
    window.updateTitleAndDescription('Sims mods updater App', 'The application to handle The Sims 4 mods.');
    window.addEventListener('resize', this.onResize);
    this.onResize();
    const _this = this;
    Backend.loadFacts().then(facts => _this.facts = facts);
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
  }
}
</script>

<style scoped>
.delete-icon {
  color: var(--el-color-danger);
}

.discord-btn {
  padding: 2px !important;
  vertical-align: top;
  height: 42px;
}
</style>