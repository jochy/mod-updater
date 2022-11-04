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
      <li>{{ $t(`message.changelog.${this.version}.features.recover_versioning`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.mods_screen_redesign`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.bulk_operations`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.log_in`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.mod_group`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.adeepindigo`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.features.feedback`) }}</li>
    </ul>
    <b>{{ $t(`message.changelog.fixes`) }}</b>
    <ul>
      <li>{{ $t(`message.changelog.${this.version}.fixes.loading`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.fixes.disabled_popup`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.fixes.close_button`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.fixes.update_disabled_mod`) }}</li>
    </ul>
    <b>{{ $t(`message.changelog.others`) }}</b>
    <ul>
      <li>{{ $t(`message.changelog.${this.version}.others.search_engine`) }}</li>
      <li>{{ $t(`message.changelog.${this.version}.others.ads`) }}</li>
    </ul>
    <el-button link type="primary"><a target="_blank" href="https://www.buymeacoffee.com/joch/sims-mods-updater-2-5-0">More...</a></el-button>
  </div>
</template>

<script>
import Backend from "../../backend.js";
import {mapGetters} from "vuex";

export default {
  name: "Changelog20500",
  data: function () {
    return {
      version: '2_5_x',
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
