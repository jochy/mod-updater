<template>
  <div ref="modsContainer">
    <el-tabs>
      <el-tab-pane :label="$t('message.mods.installed_mods')">
        <div ref="filterHeaders">
          <mod-filter v-model="modsAfterFilter" style="display:inline-block"></mod-filter>
          <el-dropdown @command="handleAction">
            <el-button type="primary" size="large" plain>
              {{ $t(`message.mods.actions_button`) }}
              <el-icon class="el-icon--right"><i class="fa-duotone fa-angle-down"></i></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="check-update">{{
                    $t(`message.mods.check_update_button`)
                  }}
                </el-dropdown-item>
                <el-dropdown-item command="rescan-folder">{{
                    $t(`message.mods.rescan_folder_button`)
                  }}
                </el-dropdown-item>
                <el-dropdown-item command="sort-mods">{{ $t(`message.mods.sort_mods_button`) }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div :style="tableStyle" v-if="modsAfterFilter.length > 0">
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2 ref="testing"
                           :columns="columns"
                           :data="modsAfterFilter"
                           :width="width"
                           :height="height"
                           :header-height="60"
                           :row-height="100"
                           :row-class="rowClass"
                           :cache="0"
              />
            </template>
          </el-auto-resizer>
        </div>

        <div v-if="modsAfterFilter.length === 0">
          <el-alert :title="$t(`message.mods.no_mods_found_title`)" type="error" :closable="false" center>
            {{ $t(`message.mods.no_mods_found_description`) }}
          </el-alert>
        </div>

        <el-dialog v-model="displayUpdatePopup" v-if="updateMods != null" title="$t(`message.app.available_updates`)"
                   width="60%" top="15px">
          <update :to-update="updates.filter(it => updateMods.includes(it.id))"
                  @close="bulkRemoveModFromUpdates"/>
        </el-dialog>

        <div class="mod-drawer">
          <el-drawer v-model="showDetail" v-if="detailModId">
            <template #header>
              <h4 style="color: var(--el-color-primary)">{{ detailModId.name }}</h4>
            </template>
            <template #default>
              <el-scrollbar>
                <div v-loading="detailMod == null">
                  <img style="max-height: 300px" :src="detailModId.preview"/>
                  <el-tabs v-if="detailMod != null">
                    <el-tab-pane :label="$t(`message.common.info_label`)">
                      <el-descriptions :column="1">
                        <el-descriptions-item :label="$t(`message.common.provider_label`)" label-class-name="key">
                          <el-link :href="detailMod.url" target="_blank" type="primary">{{
                              detailMod.provider
                            }}
                          </el-link>
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t(`message.common.creator_label`)" label-class-name="key">
                          {{ detailMod.creator }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t(`message.common.created_label`)" label-class-name="key">{{
                            date2string(new Date(detailMod.date))
                          }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t(`message.common.updated_label`)"
                                              v-if="detailMod.updated !== null"
                                              label-class-name="key">
                          {{ date2string(new Date(detailMod.updated)) }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t(`message.common.downloads_label`)"
                                              v-if="detailMod.files.length > 0" label-class-name="key">
                          {{ detailMod.downloaded }}
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t(`message.common.required_label`)"
                                              v-if="detailMod.required != null && detailMod.required.length > 0"
                                              label-class-name="key">
                          <el-space wrap size="small">
                            <el-tag type="success" v-for="item in detailMod.required" :key="item" size="small">
                              {{ item }}
                            </el-tag>
                          </el-space>
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t(`message.common.tags_label`)"
                                              v-if="detailMod.tags != null && detailMod.tags.length > 0"
                                              label-class-name="key">
                          <el-space wrap size="small">
                            <el-tag v-for="item in detailMod.tags" :key="item" size="small">{{ item }}</el-tag>
                          </el-space>
                        </el-descriptions-item>
                      </el-descriptions>
                    </el-tab-pane>
                    <el-tab-pane :label="$t(`message.common.files_label`)">
                      <el-tooltip v-for="file in detailModId.files.map(f => f.createdFiles).flat()" class="box-item"
                                  effect="dark" :content="file" placement="top-start" :key="file">
                        <p class="file-list">
                          {{ file }}
                        </p>
                      </el-tooltip>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </el-scrollbar>
            </template>
          </el-drawer>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
        <span class="custom-tabs-label">
          <span style="margin-right: 5px">{{ $t('message.mods.groups_tab_label') }}</span>
          <el-tag round effect="plain">beta</el-tag>
        </span>
        </template>
        <group-mods/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="jsx">
import {mapGetters, mapMutations} from "vuex";
import Update from "@/components/Update.vue";
import DateUtils from "../../lib/DateUtils";
import Backend from "@/backend.js";
import MultipleSelect from "@/components/ui/MultipleSelect.vue";
import {ElMessageBox} from "element-plus";
import InstalledModItem from "@/components/ui/InstalledModItem.vue";
import ModCategoryInput from "@/components/ui/ModCategoryInput.vue";
import GroupMods from "@/components/mods/GroupMods.vue";
import ModFilter from "@/components/mods/ModFilter.vue";

export default {
  name: "Mods",
  components: {Update, MultipleSelect, InstalledModItem, ModCategoryInput, GroupMods, ModFilter},
  data: function () {
    return {
      updateMods: [],
      displayUpdatePopup: false,
      showDetail: false,
      detailMod: null,
      detailModId: null,
      selectedCommonTag: "",
      screenWidth: 700,
      screenHeight: 700,
      checked: {},
      modsAfterFilter: []
    }
  },
  computed: {
    ...mapGetters(['config', 'updates', 'getInstalling', 'disableAds', 'modsCategories', 'hasPendingTask', 'disableAds']),
    checkedCount: function () {
      return Object.keys(this.checked).filter(it => this.checked[it] === true).length;
    },
    checkedEnabled: function () {
      let selected = Object.keys(this.checked).filter(it => this.checked[it] === true);
      return this.modsAfterFilter.filter(it => selected.includes(it.id) && !it.isDisabled).length;
    },
    checkedDisabled: function () {
      let selected = Object.keys(this.checked).filter(it => this.checked[it] === true);
      return this.modsAfterFilter.filter(it => selected.includes(it.id) && it.isDisabled).length;
    },
    checkedUpdate: function () {
      let selected = Object.keys(this.checked).filter(it => this.checked[it] === true);
      return this.modsAfterFilter.filter(it => selected.includes(it.id) && it.hasUpdate).length;
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
          width: 200,
          align: 'center',
          cellRenderer: (cellData) => <div>{!cellData.rowData.isDisabled ?
              <el-badge value={this.$t(`message.common.update_label`)}
                        type="success" class="verbose-badge" hidden={!cellData.rowData.hasUpdate}>
                <el-image src={cellData.rowData.preview} lazy fit="scale-down"></el-image>
              </el-badge>
              :
              <el-badge value={this.$t(`message.common.disabled_label`)} type="info" class="verbose-badge">
                <el-image src={cellData.rowData.preview} lazy fit="scale-down"></el-image>
              </el-badge>
          }</div>
        },
        {
          key: 'name',
          width: this.screenWidth - 300,
          align: 'center',
          cellRenderer: (cellData) => <el-button text type="primary" class="title"
                                                 onClick={e => this.detail(cellData.rowData)}>{cellData.rowData.name}</el-button>,

          headerCellRenderer: () => {
            return <span
                style="font-weight:400">{this.$t(`message.mods.selected_label`, {nb: this.checkedCount})}</span>
          },
        },
        {
          key: 'buttons',
          width: 220,
          align: 'center',
          cellRenderer: (cellData) => <div>
            <ModCategoryInput value={cellData.rowData.category}
                              key={cellData.rowData.id + '-cat-' + cellData.rowData.category}
                              onCategoryChanged={e => this.categoryChanged(cellData.rowData, e)}/>
            <el-button-group size="default" style="margin-top: 10px">
              <el-button type="danger" class="tooltip" plain
                         onClick={$event => this.wantToRemove($event, cellData.rowData)}>
                <i class="fa-duotone fa-trash-can"></i>
                <span class="tooltiptext">{this.$t(`message.common.remove_label`)}</span>
              </el-button>
              {!cellData.rowData.isDisabled ?
                  <el-button type="warning" plain disabled={cellData.rowData.isInstalling} class="tooltip"
                             onClick={$event => this.wantToDisable($event, cellData.rowData)}>
                    <i class="fa-duotone fa-power-off"></i>
                    <span class="tooltiptext">{this.$t(`message.common.disable_label`)}</span>
                  </el-button>
                  :
                  <el-button type="warning" plain disabled={cellData.rowData.isInstalling} class="tooltip"
                             onClick={$event => this.enable($event, cellData.rowData)}>
                    <i class="fa-duotone fa-power-off"></i>
                    <span class="tooltiptext">{this.$t(`message.common.enable_label`)}</span>
                  </el-button>
              }
              {cellData.rowData.isInstalling ? <el-button type="info" plain loading></el-button> : ""}
              {!cellData.rowData.isInstalling && cellData.rowData.ignoreUpdateUntil != null ?
                  <el-button type="success" plain onClick={$event => this.unignore($event, cellData.rowData)}
                             class="tooltip">
                    <i class="fa-duotone fa-check"></i>
                    <span class="tooltiptext">{this.$t(`message.common.unignore_update_until_next_one`)}</span>
                  </el-button>
                  :
                  <el-button type="success" plain disabled={!cellData.rowData.hasUpdate} class="tooltip"
                             onClick={$event => this.askUpdate($event, cellData.rowData)}>
                    <i class="fa-duotone fa-download"></i>
                    <span class="tooltiptext">{this.$t(`message.common.update_label`)}</span>
                  </el-button>
              }
            </el-button-group>
          </div>,
          headerCellRenderer: () => {
            return <div style="font-weight: 400">
              <ModCategoryInput key={`common-tag-${this.selectedCommonTag}-${this.checkedCount}`}
                                value={this.selectedCommonTag}
                                enabled={this.checkedCount > 0}
                                onCategoryChanged={e => this.bulkCategoryChanged(e)}/>
              <el-button-group size="default" style="margin-top: 5px">
                <el-button type="danger" class="tooltip" plain disabled={this.checkedCount == 0} size="small"
                           onClick={$event => this.bulkWantToRemove($event)}>
                  <i class="fa-duotone fa-trash-can"></i>
                  <span class="tooltiptext">{this.$t(`message.common.remove_label`)}</span>
                </el-button>
                <el-button type="warning" plain disabled={this.checkedEnabled === 0} class="tooltip" size="small"
                           onClick={$event => this.bulkWantToDisable($event)}>
                  <i class="fa-duotone fa-power-off"></i>
                  <span class="tooltiptext">{this.$t(`message.common.disable_label`)}</span>
                </el-button>
                <el-button type="warning" plain disabled={this.checkedDisabled === 0} class="tooltip" size="small"
                           onClick={$event => this.bulkEnable($event)}>
                  <i class="fa-duotone fa-power-off"></i>
                  <span class="tooltiptext">{this.$t(`message.common.enable_label`)}</span>
                </el-button>
                <el-button type="success" plain disabled={this.checkedUpdate === 0} class="tooltip" size="small"
                           onClick={$event => this.bulkAskUpdate($event)}>
                  <i class="fa-duotone fa-download"></i>
                  <span class="tooltiptext">{this.$t(`message.common.update_label`)}</span>
                </el-button>
              </el-button-group>
            </div>
          }
        },
      ]
    },
    tableStyle: function () {
      return `width:${this.screenWidth}px;height:${this.screenHeight}px`;
    },
  },
  watch: {
    checked: {
      handler: function () {
        let selectedIds = Object.keys(this.checked).filter(it => this.checked[it] === true);
        let allTags = this.modsAfterFilter.filter(it => selectedIds.includes(it.id)).map(it => it.category);
        allTags = [...new Set(allTags)];
        if (allTags.length === 1) {
          this.selectedCommonTag = allTags[0];
        } else {
          this.selectedCommonTag = "";
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['removeModFromUpdates', 'incrementAskLoading']),
    rowClass: function (args) {
      if (args.rowData.hasUpdate) {
        return "bg-update";
      } else if (args.rowData.isDisabled) {
        return "bg-disabled";
      }
    },
    onResize: function () {
      this.screenWidth = this.$refs.modsContainer.clientWidth;
      this.screenHeight = window.innerHeight - this.$refs.filterHeaders.clientHeight - 230 - (this.hasPendingTask || !this.disableAds ? 100 : 0);
    },
    blur: function (el) {
      if (el.target.tagName !== 'BUTTON' && el.target.parentElement.tagName === 'BUTTON') {
        el.target.parentElement.blur();
      } else {
        el.target.blur();
      }
    },
    date2string: function (date) {
      return DateUtils.dateToString(date);
    },
    detail: async function (mod) {
      this.detailMod = null;
      this.showDetail = true;
      this.detailModId = mod;
      this.detailMod = await Backend.getById(mod.id);
    },
    askUpdate: function ($event, mod) {
      this.blur($event);
      this.updateMods = [mod.id];
      this.displayUpdatePopup = true;
    },
    bulkAskUpdate: function ($event) {
      this.blur($event);
      this.updateMods = Object.keys(this.checked).filter(it => this.checked[it] === true);
      this.displayUpdatePopup = true;
    },
    bulkRemoveModFromUpdates: function () {
      this.updateMods.forEach(it => this.removeModFromUpdates(it));
      this.displayUpdatePopup = false;
    },
    wantToRemove: function ($event, mod) {
      this.blur($event);

      ElMessageBox.confirm(
          this.$t(`message.mods.remove_popup.desc`, {modName: mod.name}),
          this.$t(`message.mods.remove_popup.title`), {
            confirmButtonText: this.$t(`message.common.remove_label`),
            confirmButtonClass: "el-button--danger",
            cancelButtonText: this.$t(`message.common.cancel_button`),
            type: 'error',
            dangerouslyUseHTMLString: true,
          })
          .then(() => this.remove(mod.id, mod.name))
          .catch(() => console.log("Remove cancelled"));
    },
    bulkWantToRemove: function ($event) {
      this.blur($event);

      ElMessageBox.confirm(
          this.$t(`message.mods.bulk_remove_popup.desc`),
          this.$t(`message.mods.remove_popup.title`), {
            confirmButtonText: this.$t(`message.common.remove_label`),
            confirmButtonClass: "el-button--danger",
            cancelButtonText: this.$t(`message.common.cancel_button`),
            type: 'error',
            dangerouslyUseHTMLString: true,
          })
          .then(() => this.bulkRemove())
          .catch(() => console.log("Remove cancelled"));
    },
    remove: function (id, name) {
      window.ipcRenderer.send('remove-mod', {
        id: id,
        name: name
      });
    },
    bulkRemove: function () {
      let selected = Object.keys(this.checked).filter(it => this.checked[it] === true);
      for (let id of selected) {
        let mod = this.config.mods.find(it => it.id === id);
        this.remove(mod.id, mod.name);
      }
    },
    unignore: function ($event, mod) {
      this.blur($event);
      window.ipcRenderer.send('unignore-mod', {id: mod.id});
    },
    wantToDisable: function ($event, mod) {
      this.blur($event);
      ElMessageBox.confirm(
          this.$t(`message.mods.disable_popup.desc`, {modName: mod.name}),
          this.$t(`message.mods.disable_popup.title`), {
            confirmButtonText: this.$t(`message.common.disable_label`),
            confirmButtonClass: "el-button--warning",
            cancelButtonText: this.$t(`message.common.cancel_button`),
            type: 'warning',
            dangerouslyUseHTMLString: true,
          })
          .then(() => this.disable(mod.id, mod.name))
          .catch(() => console.log("Disable cancelled"));
    },
    bulkWantToDisable: function ($event) {
      this.blur($event);
      ElMessageBox.confirm(
          this.$t(`message.mods.bulk_disable_popup.desc`),
          this.$t(`message.mods.disable_popup.title`), {
            confirmButtonText: this.$t(`message.common.disable_label`),
            confirmButtonClass: "el-button--warning",
            cancelButtonText: this.$t(`message.common.cancel_button`),
            type: 'warning',
            dangerouslyUseHTMLString: true,
          })
          .then(() => this.bulkDisable())
          .catch(() => console.log("Disable cancelled"));
    },
    disable: function (id, name) {
      console.log('disable');
      window.ipcRenderer.send('disable-mod', {
        id: id,
        name: name
      });
    },
    bulkDisable: function () {
      let selected = Object.keys(this.checked).filter(it => this.checked[it] === true);
      for (let id of selected) {
        let mod = this.config.mods.find(it => it.id === id);
        this.disable(mod.id, mod.name);
      }
    },
    categoryChanged: function (mod, category) {
      console.log(`${mod.id} -> ${category}`);
      window.ipcRenderer.send('edit-mod', {
        id: mod.id,
        params: {category: category},
      });
    },
    bulkCategoryChanged: function (category) {
      let selected = Object.keys(this.checked).filter(it => this.checked[it] === true);
      for (let id of selected) {
        window.ipcRenderer.send('edit-mod', {
          id: id,
          params: {category: category},
        });
      }
    },
    handleAction: function (command) {
      if (command === 'check-update') {
        window.ipcRenderer.send('ask-check-update');
      } else if (command === 'rescan-folder') {
        window.ipcRenderer.send('ask-scan-folder');
        this.incrementAskLoading();
      } else if (command === 'sort-mods') {
        window.ipcRenderer.send('ask-sort-mods');
        this.incrementAskLoading();
      }
    },
    enable: function ($event, mod) {
      if ($event) {
        this.blur($event);
      }
      window.ipcRenderer.send('enable-mod', {
        id: mod.id,
        name: mod.name
      });
    },
    bulkEnable: function ($event) {
      this.blur($event);

      let selected = Object.keys(this.checked).filter(it => this.checked[it] === true);
      for (let id of selected) {
        let mod = this.config.mods.find(it => it.id === id);
        this.enable(null, mod);
      }
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
    window.updateTitleAndDescription('Sims mods updater - My mods', 'All your mods are displayed here');
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize);
  }
}
</script>

<style scoped>
.image {
  width: 100%;
  height: 170px;
  object-fit: cover;
  display: block;
}

.file-list {
  direction: rtl;
  white-space: nowrap;
}


</style>