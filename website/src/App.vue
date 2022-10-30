<template>
  <el-container>
    <el-alert v-if="!isApp" :title="$t(`message.app.app_required_title`)" type="warning"
              :closable="false" center show-icon>
      {{ $t(`message.app.app_required_warning`) }}
      <router-link to="/download">{{ $t(`message.common.link`) }}</router-link>
    </el-alert>
    <el-header>
      <Header/>
    </el-header>

    <el-container>
      <el-aside width="65px" class="menu-left">
        <Menu/>
      </el-aside>
      <el-container>
        <el-scrollbar :wrap-style="scrollStyle" @scroll="onScroll" native>
          <el-container
              :style="`width: calc(100% - ${disableAds || windowWidth < 500 ? '0' : '132'}px);display: inline-block`">
            <el-main ref="scrollable" style="overflow-x: hidden" id="scrollContent">
              <router-view v-slot="{ Component }" :key="$route.fullPath">
                <transition name="fade" mode="out-in">
                  <component :is="Component"></component>
                </transition>
              </router-view>
            </el-main>
          </el-container>
          <el-aside v-if="!disableAds && windowWidth > 500" width="122px"
                    style="display: inline-block; overflow: hidden; vertical-align: top; background-color: transparent; border:none;max-height: calc(100vh - 212px)">
            <el-affix :offset="130">
              <ads type="vertical" :reload="true"/>
            </el-affix>
          </el-aside>
        </el-scrollbar>
        <el-footer v-if="isApp && (hasPendingTask || !disableAds)">
          <scheduler/>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>

  <CoffeePopup v-model="showCoffeePopup"/>

  <el-dialog
      v-model="requireConfig"
      :title="$t(`message.config.configure_title`)"
      width="60%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
  >
    <config :proposal="proposal" :proposal-exists="proposalExists" :proposal-tray="proposalTray"
            :proposal-tray-exists="proposalTrayExists"/>
  </el-dialog>

  <el-dialog v-model="updatePopup" :title="$t(`message.update.update_found_title`)" width="80%" top="15px">
    <update :to-update="updateCfg" @close="updatePopup = false"/>
  </el-dialog>

  <el-dialog
      v-model="upgradeRequired"
      :title="$t(`message.app.new_app_update_required`)"
      width="40%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
  >
    <h3>{{ $t(`message.app.new_app_update_available_title_summary`) }}</h3>
    <p>{{ $t(`message.app.new_app_update_text`) }}</p>
    <a href="https://sims-mods-updater.com/download" target="_blank">
      <el-button type="primary" plain>{{ $t(`message.app.new_app_update_button`) }}</el-button>
    </a>
  </el-dialog>

  <changelog v-if="changelogVersion != null" :version="changelogVersion"/>

  <mac-not-well-started-popup v-model="macNotWellStarted"/>
</template>

<script>
import Menu from './components/Menu.vue';
import Header from './components/Header.vue';
import Config from './components/Config.vue';
import Scheduler from "@/components/Scheduler.vue";
import Update from "@/components/Update.vue";
import {mapGetters, mapMutations} from 'vuex';
import {ElLoading, ElMessage, ElNotification,} from 'element-plus'
import Changelog from "@/components/changelog/changelog.vue";
import Semver from "../lib/Semver";
import CoffeePopup from "@/components/ui/CoffeePopup.vue";
import MacNotWellStartedPopup from "@/components/ui/MacNotWellStartedPopup.vue";
import Ads from "@/components/google/Ads.vue";

export default {
  name: 'App',
  components: {Ads, Changelog, Menu, Header, Config, Scheduler, Update, CoffeePopup, MacNotWellStartedPopup},
  data: function () {
    return {
      windowHeight: window.innerHeight - 65 - 95,
      windowWidth: window.innerWidth,
      requireConfig: false,
      upgradeRequired: false,
      proposalExists: false,
      proposal: null,
      proposalTray: null,
      proposalTrayExists: false,
      updatePopup: false,
      showCoffeePopup: false,
      macNotWellStarted: false,
      updateCfg: null,
      scheduler: null,
      header: 65,
      changelogVersion: null,
      loadingMods: null,
      loadingStatus: this.$t(`message.app.loading`),
      svg: `<path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>`
    }
  },
  computed: {
    ...mapGetters(['isApp', 'hasPendingTask', 'applicationManifest', 'askLoading', 'config', 'getStatus', 'disableAds']),
    scrollStyle: function () {
      return `height: calc(100vh - ${this.header}px)`
    }
  },
  watch: {
    loadingStatus: function (val) {
      this.loadingMods.setText(val);
    },
    askLoading: async function (val, old) {
      console.log("Ask loading " + val + " " + old);
      if (this.loadingMods != null) {
        console.log('closing previous layout');
        this.loadingMods.close();
        await this.$nextTick();
        this.loadingMods.close();
      }
      console.log("Starting loading screen");
      this.loadingMods = ElLoading.service({
        lock: true,
        fullscreen: true,
        text: this.$t(`message.app.loading`),
        svgViewBox: '-10, -10, 50, 50',
        svg: this.svg,
      });
    },
    disableAds: function () {
      this.onResize();
    }
  },
  methods: {
    ...mapMutations(['setScroll', 'useApp', 'setConfig', 'schedulerStatus', 'setDisableAds',
      'setUpdates', 'setApplicationManifest', 'incrementAskLoading', 'setIssues', 'updateStatus',
      'setCommits']),
    onResize: function () {
      this.header = 66;
      if (!this.isApp || this.hasPendingTask || !this.disableAds) {
        this.header += 93;
      }
      if (!this.isApp) {
        this.header -= 25;
      }
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight - this.header - (this.windowWidth < 500 ? 20 : 0);
    },
    onScroll: function (event) {
      this.setScroll((event.scrollTop + this.windowHeight) / this.$refs.scrollable.$el.clientHeight);
    },
    checkVersion: function (version) {
      const minVersion = "2.5.0";
      if (this.applicationManifest == null || version == null || Semver._toLong(version) < Semver._toLong(minVersion)) {
        console.log(version + ' is less than ' + minVersion);
        this.upgradeRequired = true;
        window.sendGtagEvent("upgrade-required");
      } else {
        console.log(`${version} (${Semver._toLong(version)}) is more or equals to ${minVersion} (${Semver._toLong(minVersion)})`)
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    if (window.isModAppElectron) {
      this.loadingMods = ElLoading.service({
        lock: true,
        fullscreen: true,
        text: this.$t(`message.app.loading`),
        svgViewBox: '-10, -10, 50, 50',
        svg: this.svg,
      });
      this.useApp();
      const _this = this;
      setTimeout(function () {
        if (_this.applicationManifest == null) {
          _this.checkVersion(null);
        }
      }, 5000);
      window.ipcRenderer.on('app-manifest', function (event, msg) {
        _this.setApplicationManifest(msg);
        _this.checkVersion(msg.version);
      });
      window.ipcRenderer.on('mods-loaded', async function () {
        console.log("Close loading layout");
        _this.loadingMods.close();
        await _this.$nextTick();
        console.log("2nd close");
        _this.loadingMods.close();
      });
      window.ipcRenderer.on('ask-config', function (event, msg) {
        _this.requireConfig = msg.required;
        if (_this.requireConfig) {
          _this.loadingMods.close();
        }
        _this.proposalExists = msg.proposalExists;
        _this.proposal = msg.proposal;
        _this.proposalTray = msg.proposalTray;
        _this.proposalTrayExists = msg.proposalTrayExists;
        console.log(msg);
        if (msg.required) {
          console.log('Config required');
        } else {
          console.log('Config saved');
        }
      });
      window.ipcRenderer.on('config-saved', function (event, msg) {
        _this.setConfig(msg.config);
      });
      window.ipcRenderer.on('load-progression', function (event, msg) {
        _this.loadingStatus = _this.$t(msg.text, msg.params);
      });
      window.ipcRenderer.on('scheduler-status', function (event, msg) {
        _this.schedulerStatus(msg);
      });
      window.ipcRenderer.on('install-mod-result', function (event, msg) {
        ElMessage({
          message: _this.$t(`message.app.notify.mod_${msg.type}`, {modName: msg.name}),
          type: 'success',
          showClose: true,
        });
        window.sendGtagEvent("installed", {mod: msg.name});
      });
      window.ipcRenderer.on('remove-mod-result', function (event, msg) {
        ElMessage({
          message: _this.$t(`message.app.notify.mod_removed`, {modName: msg.name}),
          type: 'success',
          showClose: true,
        });
        window.sendGtagEvent("removed", {mod: msg.name});
      });
      window.ipcRenderer.on('display-error', function (event, msg) {
        ElMessage({
          message: msg,
          type: 'error',
          showClose: true,
        });
        window.sendGtagEvent("error", {msg: msg});
      });
      window.ipcRenderer.on('to-update', function (event, msg) {
        _this.updateCfg = msg;
        _this.setUpdates(msg);
        if (_this.config.displayUpdatePopup) {
          _this.updatePopup = msg.length > 0 && !_this.upgradeRequired;
          if (msg.length > 0) {
            window.sendGtagEvent("show-update-popup", {nb: msg.length});
          }
        }
      });
      window.ipcRenderer.on('disable-ads', function (event, msg) {
        console.log(`Disable ads indicator: ${msg}`)
        _this.setDisableAds(msg);
      });
      window.ipcRenderer.on('changelog', function (event, msg) {
        _this.changelogVersion = msg.version;
      });
      window.ipcRenderer.on('ask-coffee', () => {
        _this.showCoffeePopup = true;
        window.sendGtagEvent("ask-coffee");
      });
      window.ipcRenderer.on('mac-not-well-started', () => {
        _this.macNotWellStarted = true;
        window.sendGtagEvent("mac-not-well-started");
      });
      window.ipcRenderer.on('issues-found', (event, msg) => {
        _this.setIssues(msg);
      });
      window.ipcRenderer.on('ask-loading-layout', () => {
        _this.incrementAskLoading();
      });
      window.ipcRenderer.on('commits-loaded', (event, msg) => {
        _this.setCommits(msg);
      });
      window.ipcRenderer.on('status-page-update', (event, msg) => {
        let previous = _this.getStatus;
        console.log(previous);
        if (previous === true && msg.status === false) {
          ElMessage({
            dangerouslyUseHTMLString: true,
            showClose: true,
            duration: 0,
            message: _this.$t(`message.app.notify.status_issue_detected`),
            type: 'error',
          });
        } else if (previous === false && msg.status === true) {
          ElMessage({
            dangerouslyUseHTMLString: true,
            showClose: true,
            duration: 0,
            message: _this.$t(`message.app.notify.status_issue_resolved`),
            type: 'success',
          });
        }
        _this.updateStatus(msg.status);
      });
      window.ipcRenderer.send('webAppLoaded');
    } else {
      setTimeout(function () {
        if (window.adsbygoogle == null || window.adsbygoogle.loaded == null || window.adsbygoogle.loaded === false) {
          ElNotification({
            title: 'Adblock detected',
            message: 'It seems you are using an adblock. Please allow ads to be displayed to help us run this website. Thank you!',
            type: 'error',
            duration: 0,
            position: 'top-left',
          });
        }
      }, 10000);
    }
    this.onResize();
    const _this = this;
    this.scheduler = setInterval(function () {
      _this.onResize();
    }, 100);
  },
  unmounted() {
    clearInterval(this.scheduler);
    window.removeEventListener('resize', this.onResize);
    window.ipcRenderer.removeAllListeners("ask-config");
    window.ipcRenderer.removeAllListeners("config-saved");
    window.ipcRenderer.removeAllListeners("install-mod-result");
    window.ipcRenderer.removeAllListeners("scheduler-status");
    window.ipcRenderer.removeAllListeners('display-error');
    window.ipcRenderer.removeAllListeners('disable-ads');
    window.ipcRenderer.removeAllListeners('changelog');
    window.ipcRenderer.removeAllListeners('mods-loaded');
    window.ipcRenderer.removeAllListeners('app-manifest');
    window.ipcRenderer.removeAllListeners('load-progression');
    window.ipcRenderer.removeAllListeners('ask-coffee');
    window.ipcRenderer.removeAllListeners('mac-not-well-started');
    window.ipcRenderer.removeAllListeners('issues-found');
    window.ipcRenderer.removeAllListeners('ask-loading-layout');
    window.ipcRenderer.removeAllListeners('status-page-update');
    window.ipcRenderer.removeAllListeners('commits-loaded');
  }
}
</script>

<style>
.el-footer {
  height: 90px !important;
  border-top: solid 1px #e6e6e6;
}

#app {
  font-family: Inter, Roboto, Oxygen, Fira Sans, Helvetica Neue, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  text-align: center;
  color: #2c3e50;
  display: flex;
  height: calc(100vh - 1px);
}

.el-aside {
  background-color: var(--el-bg-color);
  border-right: solid 1px var(--el-border-color);
  margin-right: 1px;
}

.el-header {
  padding: 0 !important;
}

.el-scrollbar {
  width: 100%;
  height: inherit !important;
}

a {
  text-decoration: none;
}

.el-alert {
  word-break: break-word;
}

#threadtagsarea {
  display: none;
}

@media screen and (max-width: 500px) {
  .menu-left {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-active {
  opacity: 0;
}

.el-space__item1 > .el-space__item {
  display: contents !important;
}

html {
  --scrollbarBG: var(--el-bg-color);
  --thumbBG: #0003;
  --el-text-color-secondary-light-9: #e7e7e7;
}

html.dark {
  --thumbBG: #fff3;
  --el-text-color-secondary-light-9: #fff3;
}

.el-scrollbar__wrap::-webkit-scrollbar {
  width: 11px;
}

.el-scrollbar__wrap {
  scrollbar-width: thin;
  scrollbar-color: var(--thumbBG) var(--scrollbarBG);
}

.el-scrollbar__wrap::-webkit-scrollbar-track {
  background: var(--scrollbarBG);
}

.el-scrollbar__wrap::-webkit-scrollbar-thumb {
  background-color: var(--thumbBG);
  border-radius: 10px;
  border: 3px solid var(--scrollbarBG);
  min-height: 30px;
  transition: all .2s ease-in-out;
}

.el-scrollbar__wrap::-webkit-scrollbar-thumb:hover {
  background-color: var(--el-text-color-secondary);
}

.verbose-badge {
  vertical-align: baseline !important;
}

.verbose-badge > .el-badge__content--success {
  right: calc(60px + var(--el-badge-size) / 2) !important;
  top: 8px !important;
}

.verbose-badge > .el-badge__content--info {
  right: calc(60px + var(--el-badge-size) / 2) !important;
  top: 8px !important;
}

.menu-badge > .el-badge__content--success {
  top: 15px !important;
}

.menu-badge > .el-badge__content--danger {
  top: 15px !important;
}

.mod-drawer > .el-overlay > div > .el-drawer__body {
  height: calc(100vh - 140px);
}

.home-container > .el-space--vertical {
  width: 100% !important;
}

.el-input--large .el-input__prefix {
  left: 12px !important;
}

.el-menu-item .el-menu-tooltip__trigger {
  display: block !important;
}

.el-button.is-text:not(.is-disabled):focus, .el-button.is-text:not(.is-disabled):hover {
  background-color: transparent !important;
}

.el-footer {
  border-top: solid 1px var(--el-border-color) !important;
}

.mod-card.el-button-group > .el-button {
  width: 45px !important;
}

.el-main {
  overflow: hidden !important;
}

.bg-update {
  background-color: var(--el-color-success-light-9) !important;
}

.bg-disabled {
  background-color: var(--el-text-color-secondary-light-9) !important;
}

.bg-disabled img {
  filter: grayscale(100%);
}

.tooltip {
  position: relative;
  display: inline-block;
}
/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: var(--el-bg-color);
  color: var(--el-color-primary);
  border: dashed 1px;
  border-color: var(--el-border-color);
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  font-size: 13px;
  bottom: 110%;
  left: 50%;
  margin-left: -45px; /* Use half of the width (120/2 = 60), to center the tooltip */
  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}
/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

.fa-circle-question {
  font-size: 18px;
}
</style>
