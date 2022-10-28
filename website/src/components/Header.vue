<template>
  <div class="header">
    <el-row>
      <el-col :span="8" class="logo-container">
        <el-page-header @back="this.$router.back()" style="margin-left: 10px"/>
        <img class="logo-img" style="width: 48px; margin-right: 10px"
             :src="isCentralSimmer ? 'https://centralsimmer.com/wp-content/uploads/2022/09/icon_lightskin_standard.png' : 'https://statics.sims-mods-updater.com/img/favicon.ico'"/>
        <div>
          <h3 class="logo-text" style="margin: 0">{{ isCentralSimmer ? 'Central Simmer' : 'Sims Mods Updater' }}</h3>
          <h6 v-if="isCentralSimmer" style="margin: 0">Sims Mods Updater</h6>
        </div>
      </el-col>
      <el-col :span="7">
        <el-input v-model="input" :placeholder="$t(`message.common.search_label`)" clearable size="large">
          <template #prefix>
            <i class="fa-duotone fa-magnifying-glass" style="line-height: 40px"></i>
          </template>
        </el-input>
      </el-col>
      <el-col :span="9" style="text-align: right">
        <locale-selector/>
        <theme-button class="theme-btn-class" style="margin-right: 5px"/>
        <el-button type="primary" plain class="twitter-btn" size="large">
          <a href="https://twitter.com/SimsModsUpdater" target="_blank" style="font-size: 24px">
            <img src="https://statics.sims-mods-updater.com/img/twitter_logo.svg" style="width: 24px"/>
          </a>
        </el-button>

        <el-button type="primary" plain class="discord-btn" size="large">
          <a href="https://discord.gg/ZDjc2C4Vfv" target="_blank">
            <img src="https://statics.sims-mods-updater.com/img/discord.png" style="width: 24px"/>
          </a>
        </el-button>
        <el-button type="primary" plain class="small-bmc-btn" size="large">
          <a href="https://buymeacoffee.com/joch" target="_blank" style="font-size: 24px">
            ☕
          </a>
        </el-button>
        <el-button type="primary" class="buy-me-a-coffee" plain size="large">
          <a class="bmc-btn" target="_blank" href="https://buymeacoffee.com/joch">
            <span style="margin-top: 4px">☕</span>
            <span class="bmc-btn-text">Buy me a coffee</span></a>
        </el-button>
        <firebase-auth/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import ThemeButton from "@/components/ui/ThemeButton.vue";
import LocaleSelector from "@/components/ui/LocaleSelector.vue";
import FirebaseAuth from "@/components/login/FirebaseAuth.vue";

export default {
  name: "Header",
  components: {ThemeButton, LocaleSelector, FirebaseAuth},
  data: function () {
    return {
      input: "",
    }
  },
  methods: {
    ...mapActions(['search']),
  },
  computed: {
    ...mapGetters(['isCentralSimmer']),
    searchQuery: function () {
      return this.$store.getters.searchQuery;
    },
    searchRequest: function () {
      return this.$store.getters.searchRequest;
    }
  },
  watch: {
    input: function (val) {
      this.search({query: val, page: 1, isNewSearch: true, filters: this.searchRequest.filters});
      this.$router.push({name: 'search'});
    },
    searchQuery: function (val) {
      if (this.input !== val && val !== "*") {
        this.input = val;
      }
    }
  },
}
</script>

<style scoped>
.header {
  background-color: var(--el-bg-color);
  align-items: center;
  height: 100%;
  vertical-align: center;
}

.el-row {
  height: 100%;
}

.el-col {
  align-self: center;
}

.logo-img {
  display: inline-block;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-text {
  display: inline-block;
  color: var(--el-color-primary);
}

.bmc-btn svg {
  height: 32px !important;
  margin-bottom: 0px !important;
  box-shadow: none !important;
  border: none !important;
  vertical-align: middle !important;
  transform: scale(0.9);
  flex-shrink: 0;
}

.bmc-btn {
  min-width: 210px;
  color: var(--el-color-primary);
  height: 40px;
  font-size: 28px;
  line-height: 27px;
  text-decoration: none !important;
  display: inline-flex !important;
  align-items: center;
  font-family: 'Cookie', cursive !important;
  text-align: start;
}

.bmc-btn:hover {
  color: var(--el-bg-color);
}

.bmc-btn-text {
  display: inline-block;
  margin-left: 25px;
  line-height: 0;
  flex-shrink: 0;
}

.small-bmc-btn {
  display: none;
  padding: 2px !important;
  vertical-align: top;
  height: 40px;
  margin-left: 0 !important;
  margin-right: 5px !important;
}

.buy-me-a-coffee {
  padding: 0 10px !important;
  margin-right: 10px !important;
}

.discord-btn {
  padding: 2px !important;
  vertical-align: top;
  height: 40px;
}

.twitter-btn {
  padding: 2px !important;
  vertical-align: top;
  height: 40px;
}


@media screen and (max-width: 486px) {
  .discord-btn {
    display: none !important;
  }

  .theme-btn {
    display: none !important;
  }
}

@media screen and (max-width: 550px) {
  .logo-text {
    display: none !important;
  }
}

@media screen and (max-width: 750px) {
  .twitter-btn {
    display: none;
  }
}

@media screen and (max-width: 670px) {
  .theme-btn-class {
    display: none;
  }
}

@media screen and (max-width: 1300px) {
  .buy-me-a-coffee {
    display: none !important;
  }

  .small-bmc-btn {
    display: inline-block !important;
  }

  .discord-btn {
    margin-right: 10px;
  }

  .logo-img {
    display: none;
  }
}

@media screen and (max-width: 1100px) {
  .logo-text {
    font-size: 14px;
  }
}
</style>