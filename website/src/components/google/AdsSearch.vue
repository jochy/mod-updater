<template>
  <el-card :body-style="{ padding: '0px' }" v-if="!disableAds">
    <div style="padding: 14px">
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="4"
                style="display: flex; align-items: center; justify-content: space-around;">
          <ads type="sized"/>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="16" style="text-align: left">
          <ads type="horizontal-not-full" style="margin: 3px 20px 3px 3px;"/>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="4" style="text-align: left; padding-left: 10px">
          <ads type="sized"/>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import Ads from "@/components/google/Ads.vue";
import {mapGetters} from "vuex";

export default {
  name: "AdsHorizontal",
  components: {Ads},
  computed: {
    ...mapGetters(['disableAds'])
  }
}
</script>
