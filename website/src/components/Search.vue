<template>
  <div ref="searchParent">
    <div class="search-filters" ref="filters">
      <el-space wrap class="el-space__item1" style="width: calc(100% - 30px); display: inline-block">
        <b class="space-right">{{ $t('message.common.sort_label') }}:</b>
        <el-select v-model="sort" class="m-2" placeholder="Sort" size="small" style="width: 130px" @change="search">
          <el-option :label="$t('message.common.sort.best_match')" value="none"/>
          <el-option :label="$t('message.common.sort.downloads')" value="downloaded"/>
          <el-option :label="$t('message.common.sort.creation_date')" value="date"/>
          <el-option :label="$t('message.common.sort.last_update')" value="updated"/>
        </el-select>
        <el-button size="small" circle style="font-weight: bold;margin-left: 2px" @click="blur($event);inverseOrder()"
                   :disabled="sort==='none'">
          <template #icon>
            <i v-if="order === 'desc' || sort === 'none'" class="fa-duotone fa-sort-down"></i>
            <i v-else class="fa-duotone fa-sort-up"></i>
          </template>
        </el-button>
        <b class="space-right space-left">{{ $t('message.common.filters_label') }} : </b>
        <el-select v-model="provider" class="m-2" :placeholder="$t('message.common.provider_label')"
                   :clearable="true" size="small" style="width: 150px" @change="search">
          <el-option label="modthesims" value="modthesims"/>
          <el-option label="thesimsresource" value="thesimsresource"/>
          <el-option label="nexusmods" value="nexus4mods"/>
          <el-option :label="$t('message.common.modder_website')" value="Modder's website"/>
          <el-option label="patreon" value="patreon"/>
          <el-option label="curseforge" value="curseforge"/>
        </el-select>
        <el-select v-model="itemType" class="space-left" :placeholder="$t(`message.common.item_type_label`)"
                   :clearable="true" size="small" style="width: 150px" @change="search">
          <el-option label="Mod" value="mod"/>
          <el-option :label="$t(`message.common.group_item_type_label`)" value="group"/>
        </el-select>
        <el-input v-model="creator" :placeholder="$t(`message.common.creator_name_label`)" clearable @change="search"
                  size="small" class="space-left" style="width: 150px"/>
        <TagInput v-model="tags" @modification="search"/>
        <el-button text size="small" :underline="false" class="clear-filters-btn" @click="blur($event);clearFilters();">
          {{ $t(`message.common.clear_filters_button`) }}
        </el-button>
      </el-space>
    </div>
    <div v-loading="isLoading" :style="'margin-top: ' + filterHeight + 'px'">
      <el-alert :title="$t(`message.common.no_results_label`)" type="error" :closable="false" center
                v-if="(searchResults.results == null || searchResults.results.length === 0) && !isLoading">
        {{ $t(`message.common.please_review_your_criteria`) }}
      </el-alert>
      <div v-for="(item, index) in searchResults.results" :key="item.document.id">
        <div v-if="index === 0" style="margin-bottom: 5px">
          <ads style="width: 100%"/>
        </div>
        <el-card :body-style="{ padding: '0px' }">
          <div style="padding: 14px">
            <el-row v-if="item.document.type === 'mod'">
              <div v-if="isApp" style="position: absolute; right:0; top: 0">
                <el-popconfirm v-if="getInstalled.includes(item.document.id)" width="300"
                               :title="$t(`message.common.are_you_sure_do_you_cant_to_remove_this_mod`)"
                               @confirm="remove(item.document.id, item.document.title)">
                  <template #reference>
                    <el-button type="danger" plain size="small">
                      <template #icon>
                        <i class="fa-duotone fa-trash-can"></i>
                      </template>
                      {{ $t(`message.common.remove_label`) }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <el-button v-else-if="getInstalling.includes(item.document.id)" type="info" plain size="small"
                           loading></el-button>
                <install-button v-else :title="item.document.title" :id="item.document.id"/>
              </div>
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4"
                      style="display: flex; align-items: center; justify-content: space-around;">
                <img v-lazy="{src: item.document.preview}" class="image"/>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="16" style="text-align: left; padding-left: 5px">
                <router-link :to="{ name: 'detail', params: { id: item.document.id }}">
                  <el-link type="primary" :underline="false"
                           style="font-size: 18px; padding-top: 5px; padding-bottom: 5px">
                    {{ item.document.title }}
                  </el-link>
                </router-link>
                <div class="bottom">
                  <p v-html="item.document.short_desc"></p>
                  <div v-if="$i18n.locale !== 'en'">
                    <el-link @click="translate(item.document)" style="margin-top: 30px">
                      {{ $t(`message.common.translate_button`) }}
                    </el-link>
                    <div v-html="getTranslate(item.document)" style="margin-top: 5px;"></div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="4" style="text-align: left; padding-left: 10px">
                <div class="bottom">
                  <p>
                    <time class="time">{{ $t(`message.common.created_label`) }} :
                      {{ date2version(new Date(item.document.date)) }}
                    </time>
                    <br/>
                    <time class="time" v-if="item.document.updated != null">{{ $t(`message.common.last_update_label`) }}
                      :
                      {{ date2version(new Date(item.document.updated)) }}
                    </time>
                  </p>
                  <p>
                    {{ $t(`message.common.creator_label`) }} :
                    <el-button type="info" plain class="tag" size="small"
                               @click="blur($event);filterCreator(item.document.creator)">
                      {{ item.document.creator }}
                    </el-button>
                  </p>
                  <p>
                    {{ $t(`message.common.source_label`) }}:
                    <el-button type="info" plain class="tag" size="small"
                               @click="blur($event);filterProvider(item.document.provider)">
                      {{ item.document.provider }}
                    </el-button>
                  </p>
                  <p>
                    {{ $t(`message.common.tags_label`) }} :
                  </p>
                  <el-button :type="isTagFiltered(tag) ? 'success' : 'primary'" plain class="tag"
                             v-for="tag in item.document.tags.slice(0, 25)" :key="tag" size="small"
                             @click="blur($event);filterNewTag(tag)">
                    {{ tag }}
                  </el-button>
                  <span v-if="item.document.tags.length >= 25">...</span>
                </div>
              </el-col>
            </el-row>

            <!-- Group -->
            <el-row v-if="item.document.type === 'group'">
              <!-- Install -->
              <div v-if="isApp" style="position: absolute; right:0; top: 0">
                <el-popconfirm v-if="getInstalledGroup.find(it => it.id === item.document.id) != null"
                               width="300"
                               :title="$t(`message.common.are_you_sure_do_you_cant_to_remove_this_mod_group`)"
                               @confirm="removeGroup(item.document.id)">
                  <template #reference>
                    <el-button type="danger" plain size="small">
                      <template #icon>
                        <i class="fa-duotone fa-trash-can"></i>
                      </template>
                      {{ $t(`message.common.remove_label`) }}
                    </el-button>
                  </template>
                </el-popconfirm>
                <group-install-button v-else :document="item.document"/>
              </div>

              <!-- Content -->
              <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4"
                      style="display: flex; align-items: center; justify-content: space-around;">
                <avatar-grid :content="item.document.mods.map(it =>{ return {img: it.preview, tooltip: it.name}})"/>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="16" style="text-align: left; padding-left: 5px">
                <router-link :to="{ name: 'detailGroup', params: { id: item.document.id }}">
                  <el-link type="primary" :underline="false"
                           style="font-size: 18px; padding-top: 5px; padding-bottom: 5px">
                    {{ item.document.title }}
                  </el-link>
                </router-link>
                <div class="bottom">
                  <p v-html="item.document.short_desc"></p>
                  <div v-if="$i18n.locale !== 'en'">
                    <el-link @click="translate(item.document)" style="margin-top: 30px">
                      {{ $t(`message.common.translate_button`) }}
                    </el-link>
                    <div v-html="getTranslate(item.document)" style="margin-top: 5px;"></div>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="4" style="text-align: left; padding-left: 10px">
                <div class="bottom">
                  <p>
                    <time class="time">{{ $t(`message.common.created_label`) }} :
                      {{ date2version(new Date(item.document.date)) }}
                    </time>
                    <br/>
                    <time class="time" v-if="item.document.updated != null">{{ $t(`message.common.last_update_label`) }}
                      :
                      {{ date2version(new Date(item.document.updated)) }}
                    </time>
                  </p>
                  <p v-if="item.document.creatorPseudo">
                    {{ $t(`message.common.creator_label`) }} :
                    <el-tag type="info" plain class="tag" size="small">
                      {{ item.document.creatorPseudo }}
                    </el-tag>
                  </p>
                  <p>
                    {{ $t(`message.common.mods_included`) }} : {{ item.document.mods.length }}
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import Ads from "@/components/google/Ads.vue";
import DateUtils from "../../lib/DateUtils";
import TagInput from "@/components/ui/TagInput.vue";
import InstallButton from "@/components/ui/InstallButton.vue";
import GroupInstallButton from "@/components/ui/GroupInstallButton.vue";
import Backend from "../backend";
import AvatarGrid from '@/components/ui/AvatarGrid.vue';
import {ElMessage} from "element-plus";

export default {
  name: "Search",
  components: {
    InstallButton, Ads, TagInput, AvatarGrid, GroupInstallButton
  },
  data: function () {
    return {
      isRetrievingNextPage: false,
      tags: [],
      provider: null,
      itemType: null,
      creator: null,
      sort: "none",
      order: 'desc',
      observer: null,
      enableWatch: false,
      filterHeight: 0,
      translated: []
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
    remove: function (id, name) {
      window.ipcRenderer.send('remove-mod', {
        id: id,
        name: name
      });
    },
    clearFilters: function () {
      this.tags.splice(0);
      this.order = 'desc';
      this.sort = 'none';
      this.provider = null;
      this.creator = null;
      this.itemType = null;
      this.search();
    },
    inverseOrder: function () {
      if (this.order === 'desc') this.order = 'asc';
      else this.order = 'desc';
      this.search();
    },
    ...mapActions(['nextPage']),
    ...mapMutations(['askSearch', 'setSearchScroll']),
    date2version: function (date) {
      return DateUtils.dateToString(date);
    },
    extractContent: function (desc) {
      let res = desc.replaceAll('<strong>', '')
          .replaceAll('</strong>', '')
          .replace(/<[^>]+>/g, '<br>').trim();
      let tmp = res.replace(/<br><br>/g, '<br>');
      while (tmp !== res) {
        res = tmp;
        tmp = tmp.replace(/<br><br>/g, '<br>');
      }
      while (res.startsWith('<br>')) {
        res = res.substring(4).trim();
      }
      return res;
    },
    isTagFiltered: function (tag) {
      return this.tags.filter(t => tag.toLowerCase().startsWith(t.tag.toLowerCase())).length > 0;
    },
    tagIndex: function (tag) {
      for (let i = 0; i < tag.length; i++) {
        if (tag.toLowerCase().startsWith(this.tags[i].tag.toLowerCase())) {
          return i;
        }
      }
      return 0;
    },
    filterProvider: function (provider) {
      if (this.provider === provider) {
        this.provider = null;
      } else {
        this.provider = provider;
      }
      this.search();
    },
    filterCreator: function (creator) {
      if (this.creator === creator) {
        this.creator = null;
      } else {
        this.creator = creator;
      }
      this.search();
    },
    filterNewTag: function (tag) {
      if (!this.isTagFiltered(tag)) {
        this.tags.push({
          tag: tag,
          exclude: false
        });
      } else {
        let t = this.tags.filter(it => it.tag.toLowerCase().startsWith(tag.toLowerCase()));
        if (t.length > 0 && t.exclude) {
          this.tags.splice(this.tagIndex(tag), 1);
        } else {
          t[0].exclude = true;
        }
      }
      this.search();
    },
    search: function () {
      this.$store.dispatch('search', {
        query: this.searchRequest.query, page: 1, isNewSearch: true, filters: {
          tags: this.tags,
          provider: this.provider,
          creator: this.creator,
          sort: this.sort,
          order: this.order,
          type: this.itemType
        }
      });
    },
    translate: async function (mod) {
      this.translated = this.translated.filter(it => it.id !== mod.id);
      const translated = await Backend.translate(mod.short_desc, this.$i18n.locale);
      this.translated.push({id: mod.id, html: translated.data.translatedText});
    },
    getTranslate: function (mod) {
      let found = this.translated.filter(it => it.id === mod.id);
      if (found.length === 0) return null;
      return found[0].html;
    },
    removeGroup: function (gid) {
      window.ipcRenderer.send('group-removed', {id: gid});
      ElMessage({
        message: this.$t(`message.common.group_uninstalled`),
        type: 'success',
      });
    }
  },
  computed: {
    ...mapGetters(['isApp', 'getInstalling', 'getInstalled', 'searchScroll', 'disableAds', 'getInstalledGroup']),
    isLoading: function () {
      return this.$store.getters.searchRequest.isLoading;
    },
    searchResults: function () {
      let res = this.$store.getters.searchResults;
      res.results.forEach(item => {
        if (item.displayAds == null) {
          item.document.short_desc = this.extractContent(item.document.short_desc);
          item.displayAds = !this.disableAds
              && Math.random() >= 0.7
              && item.document.short_desc.length < 170
              && item.document.short_desc.split('<br>').length < 6
        }
        if (this.translated[item.document.id]) {
          item.document.short_desc_translated = this.translated[item.document.id];
        }
      });
      return res;
    },
    searchRequest: function () {
      return this.$store.getters.searchRequest;
    },
    scroll: function () {
      return this.$store.getters.scroll;
    }
  },
  watch: {
    scroll: async function (val) {
      if (!this.enableWatch) return;
      if (val > 0.9 && !this.isRetrievingNextPage) {
        this.isRetrievingNextPage = true;
        await this.nextPage();
        this.isRetrievingNextPage = false;
      }
    }
  },
  mounted() {
    window.updateTitleAndDescription('Sims mods updater search', 'Search all indexed mods to install them. You can see the detail and install them if you want. Our application will handle the automatic update when available.');
    if (!this.isLoading && this.searchRequest.query === "") {
      this.$store.dispatch('search', {query: '*', page: 1, isNewSearch: true});
    }
    if (this.searchRequest.filters != null) {
      this.order = this.searchRequest.filters.order;
      this.sort = this.searchRequest.filters.sort;
      this.provider = this.searchRequest.filters.provider;
      this.creator = this.searchRequest.filters.creator;
      this.itemType = this.searchRequest.filters.type;
      this.tags.splice(0);
      this.tags.push(...this.searchRequest.filters.tags);
    }
    try {
      const _this = this;
      this.observer = new ResizeObserver(function () {
        _this.filterHeight = _this.$refs.filters.clientHeight;
      });
      this.observer.observe(this.$refs.filters);
    } catch (e) {
      // Ignore
    }
    this.$nextTick(() => {
      this.enableWatch = true;
      document.getElementsByClassName('el-scrollbar__wrap')[0].scrollTop = this.searchScroll;
    });
  },
  beforeUnmount() {
    this.setSearchScroll(document.getElementsByClassName('el-scrollbar__wrap')[0].scrollTop);
  },
  unmounted() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
</script>

<style scoped>
.image {
  width: 100%;
  max-width: 250px;
  max-height: 200px;
}

.bottom {
  line-height: 12px;
  align-items: center;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

p {
  margin: 2px;
}

.el-card {
  margin-bottom: 5px;
}

.tag {
  padding: 3px;
  margin: 1px;
  min-height: 0;
  font-size: 12px;
}

.search-filters {
  position: absolute;
  background-color: var(--el-bg-color);
  z-index: 1;
  width: calc(100% - 26px);
  top: 0;
  left: 0;
  text-align: left;
  padding: 5px 5px 10px 10px;
  line-height: 30px;
  border-bottom: 1px solid var(--el-border-color);
}

.space-right {
  margin-right: 5px;
}

.space-left {
  margin-left: 5px;
}

.clear-filters-btn {
  margin-left: auto;
  color: var(--el-color-danger);
  font-size: 13px;
  padding: 3px;
}

.clear-filters-btn:hover {
  border: 1px solid var(--el-color-danger);
}
</style>