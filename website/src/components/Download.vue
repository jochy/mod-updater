<template>
  <div>
    <el-row :gutter="20">
      <el-card :body-style="{ padding: '0px' }" style="width: 100%; margin: 10px">
        <div style="padding: 14px">
          <p><b>{{ $t(`message.download.why_is_there_an_app`) }}</b>
            <br/>
            {{ $t(`message.download.explain_why_is_there_an_app`) }}
          </p>
          <p><b>{{ $t(`message.download.what_do_i_need`) }}</b><br/>{{ $t(`message.download.explain_what_do_i_need`) }}</p>
          <p><b>{{ $t(`message.download.how_does_it_works`) }}</b><br/>
            {{ $t(`message.download.explain_dow_does_it_works_1`) }}
            <br/>
            <img src="https://statics.sims-mods-updater.com/img/configure-app.png"
                 style="max-width: 400px; padding: 10px"/>
            <br/>
            {{ $t(`message.download.explain_dow_does_it_works_2`) }}
            <br/>
            {{ $t(`message.download.explain_dow_does_it_works_3`) }}
          </p>
        </div>
      </el-card>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card :body-style="{ padding: '0px' }" class="card-download">
          <img src="https://statics.sims-mods-updater.com/img/windows.svg" class="image"/>
          <div style="padding: 10px">
            <h3>Windows</h3>
            <hr/>
            <div class="bottom">
              <a :href="`${downloadHostName}/download/win32`" target="_blank">
                <el-button type="primary" plain @click="incrementDownloadCounter">sims-mod-updater.exe</el-button>
              </a>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card :body-style="{ padding: '0px' }" class="card-download">
          <img src="https://statics.sims-mods-updater.com/img/linux.svg" class="image"/>
          <div style="padding: 10px">
            <h3>Linux</h3>
            <hr/>
            <div class="bottom">
              <a :href="`${downloadHostName}/download/rpm`" target="_blank">
                <el-button type="primary" plain @click="incrementDownloadCounter">sims-mod-updater.rpm</el-button>
              </a>
              <a :href="`${downloadHostName}/download/deb`" target="_blank"
                 style="margin-top: 2px; display: block">
                <el-button type="primary" plain @click="incrementDownloadCounter">sims-mod-updater.deb</el-button>
              </a>
              <a href="https://snapcraft.io/sims-mod-updater" target="_blank" style="margin-top: 2px; display: block">
                <el-button type="primary" plain @click="incrementDownloadCounter">sims-mod-updater.snap</el-button>
              </a>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card :body-style="{ padding: '0px' }" class="card-download">
          <img src="https://statics.sims-mods-updater.com/img/mac.svg" class="image"/>
          <div style="padding: 10px">
            <h3>MacOS</h3>
            <hr/>
            <div class="bottom">
              <a :href="`${downloadHostName}/download/dmg`" target="_blank">
                <el-button type="primary" plain @click="incrementDownloadCounter">sims-mod-updater.dmg</el-button>
              </a>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <ads/>
  </div>
</template>

<script>
import Ads from "@/components/google/Ads.vue";
import axios from 'axios';
import {mapGetters} from "vuex";

export default {
  name: "Download",
  components: {Ads},
  computed: {
    ...mapGetters(['isCentralSimmer']),
    downloadHostName: function() {
      if (this.isCentralSimmer) {
        return "https://cs-download.sims-mods-updater.com";
      }
      return "https://download.sims-mods-updater.com";
    }
  },
  methods: {
    incrementDownloadCounter: async function() {
      await axios.get("https://us-central1-smod-manager.cloudfunctions.net/incrementCounter")
          .catch(() => console.info('Unable to increment download counter'));
    }
  },
  mounted() {
    window.updateTitleAndDescription('Sims mods updater Download', 'Download the app that allows you to update your The Sims 4 mods and custom content installed. Available to windows, Linux and MacOS.');
  }
}
</script>

<style scoped>
.image {
  width: 128px;
  padding: 10px;
}

.card-download {
  min-height: 410px;
}

.card-download  button {
  width: 200px;
}
</style>