<template>
  <div v-if="shouldDisplay && !disableAds" ref="div" :style="style" v-html="adsenseContent"/>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";

export default {
  name: "Ads",
  props: {
    type: {
      type: String,
      default() {
        return "horizontal"
      }
    },
    reload: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  computed: {
    ...mapGetters(['disableAds', 'displayedAds']),
    style: function () {
      if (this.type === 'vertical') return 'width: 100%';
      else if (this.type === 'sized' || this.type === 'leaderboard' || this.type === 'sized-mod') return '';
      else if (this.height > 0) return `width:${this.width}px;min-height:${this.height}px`;
      else if (this.type === 'horizontal-not-full') return `height:280px`;
      else if (this.type === 'footer') return `height:90px`;
      return `width:${this.width}px;height:280px`;
    },
    id: function () {
      if (this.type === 'vertical') {
        return "divadsensedisplaynonevertical";
      } else if (this.type === 'sized') {
        return "divadsensedisplaynonesized";
      } else if (this.type === 'leaderboard') {
        return 'divleaderboarddisplaynone';
      } else if (this.type === 'sized-mod') {
        return 'adsensesizedmod';
      } else if (this.type === 'footer') {
        return 'adsensefooter';
      }
      return "divadsensedisplaynone";
    },
    route: function() {
      return this.$route.name;
    }
  },
  data: function () {
    return {
      width: 0,
      adsenseContent: '',
      height: -1,
      reloadScheduler: null,
      shouldDisplay: false,
    }
  },
  methods: {
    ...mapMutations(['addDisplayedAd', 'removeDisplayedAd']),
    onResize: function () {
      this.width = window.innerWidth - 95;
    },
    loadAds: async function () {
      if (this.adsenseContent.length > 0) {
        console.log("reloading");
        this.height = this.$refs.div.clientHeight;
        this.adsenseContent = "";
        await this.$nextTick();
        await this.$nextTick();
      }
      this.adsenseContent = document.getElementById(this.id).innerHTML;
      await this.$nextTick();
      await this.$nextTick();
      window.triggerAdsense();

      if (this.reload && this.reloadScheduler == null) {
        //this.reloadScheduler = setInterval(this.loadAds, 40000);
      }
    },
    newPage: function() {
      /*if (this.route === 'mods') {
        console.log("No reload");
        return;
      }*/
      if (this.reloadScheduler != null) {
        clearInterval(this.reloadScheduler);
        this.reloadScheduler = null;
      }
      this.loadAds();
    }
  },
  mounted() {
    if (!this.disableAds) {
      this.shouldDisplay = true;//this.displayedAds < 50;
      if (this.shouldDisplay) {
        this.addDisplayedAd();
        window.addEventListener('resize', this.onResize);
        this.onResize();
        this.loadAds();
        if (this.reload) {
          window.addEventListener('new-page', this.newPage);
        }
      }
    }
  },
  unmounted() {
    if (this.shouldDisplay && !this.disableAds) {
      this.removeDisplayedAd();
      if (this.reload) {
        clearInterval(this.reloadScheduler);
      }
      window.removeEventListener('resize', this.onResize);
      window.removeEventListener('new-page', this.newPage);
    }
  }
}
</script>

<style scoped>
.debug {
  background-color: red;
}
</style>