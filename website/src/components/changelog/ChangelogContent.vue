<template>
  <div style="text-align: left">
    <div style="display:inline-block; float:right;text-align: right">
      <span style="font-style: normal;font-size: 12px">{{ $t(`message.changelog.feeling_about`)}}</span><br/>
      <el-rate  :colors="colors" @change="submitFeedback" v-model="userRating"></el-rate>
    </div>
    <h2 style="text-align: center">
      Changelog {{ version.replaceAll('_', '.') }}
    </h2>
    <b>{{ $t(`message.changelog.features`) }}</b>
    <ul>
      <li>{{ $t(`message.changelog.${this.version}.features.modpack_screen_table`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.mod_screen_number_displayed`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.task_count`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.display_last_update`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.mod_search_speed`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.ignore_mod_to_install_modpack`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.rich_text_editor`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.rate`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.kiara`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.curseforge`) }}</li>
    </ul>
    <b>{{ $t(`message.changelog.fixes`) }}</b>
    <ul>
      <li>{{ $t(`message.changelog.${this.version}.fixes.enable_versioning`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.fixes.ignore_update_until_next_one`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.fixes.srslysims`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.fixes.locking_mecanism`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.fixes.icemunmun_title`) }}</li>
    </ul>
    <b>{{ $t(`message.changelog.others`) }}</b>
    <ul>
      <li v-html="$t(`message.changelog.${this.version}.others.website_code`)"></li>
      <li>{{ $t(`message.changelog.${this.version}.others.deduplicate`) }}</li>
    </ul>
    <el-button link type="primary"><a target="_blank" href="https://www.buymeacoffee.com/joch/sims-mods-updater-2-6-0">More...</a></el-button>
  </div>
</template>

<script>
import Backend from "../../backend.js";
import {mapGetters} from "vuex";

export default {
  name: "ChangelogContent",
  data: function () {
    return {
      version: '2_6_x',
      userId: null,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      userRating: 0
    }
  },
  methods: {
    submitFeedback: async function (val) {
      await Backend.rate(this.userId, this.version, val, 'Version');
    }
  },
  computed: {
    ...mapGetters(['config']),
  },
  watch: {
    config: {
      handler: async function() {
        await this.$nextTick();
        if (this.userId == null) {
          this.userId = this.config.uniqueId;
          if (this.userId != null) {
            const _this = this;
            Backend.getRate(this.userId, this.version, 'Version').then(res => _this.userRating = res.score);
          }
        }
      },
      deep: true
    }
  }
}
</script>
