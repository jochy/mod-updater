<template>
  <a v-if="!disableAds" href="https://earnapp.com/i/9p4vptd" target="_blank">
    <el-card shadow="never" :body-style="height">
      <div>
        <img src="https://earnapp.com/dashboard/www/earnapp_cp/pub/img/earnapp/logo.svg"/>
        <div>
          <h2>Earn passive income while your devices rest</h2>
          <h4>Make big money, safely, by sharing the unused network on your resting devices</h4>
        </div>
      </div>
    </el-card>
  </a>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "AdsEarnapp",
  props: {
    fixedHeight: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    ...mapGetters(['disableAds']),
    height: function () {
      return this.fixedHeight ? "height: 280px;display: flex;vertical-align:middle;justify-content: center;align-items: center" : "";
    }
  }
}
</script>
