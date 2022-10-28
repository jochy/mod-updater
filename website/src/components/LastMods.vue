<template>
  <el-card shadow="always" class="cardTitle">
    <h3>{{ title }}</h3>
    <el-space v-if="lastUpdated == null">
      <el-card :body-style="{ padding: '0px', height: '260px', width: '200px' }" v-for="item in 5" :key="item">
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="image" class="imgPreview"/>
            <el-skeleton-item variant="text" class="modLink"/>
          </template>
        </el-skeleton>
      </el-card>
    </el-space>

    <el-space v-if="lastUpdated != null" :wrap="true" style="justify-content: center">
      <el-card :body-style="{ padding: '0px', height: '260px' }" v-for="item in lastUpdated" :key="item.document.id">
        <img v-lazy="{src: item.document.preview}" class="imgPreview"/>
        <div class="modLink">
          <router-link :to="{ name: 'detail', params: { id: item.document.id }}">
            <el-link type="primary">
              {{ item.document.title }}
            </el-link>
          </router-link>
        </div>
      </el-card>
    </el-space>
  </el-card>
</template>

<script>
import Backend from '../backend.js';

export default {
  name: "LastMods",
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      lastUpdated: null
    }
  },
  computed: {
    title: function () {
      return this.type === 'updated' ? this.$t(`message.app.last_updated_mods`) : this.$t(`message.app.most_downloaded_mods`);
    }
  },
  async mounted() {
    if (this.type === 'updated') {
      this.lastUpdated = (await Backend.lastUpdated()).hits;
    } else {
      this.lastUpdated = (await Backend.mostDownloaded()).hits;
    }
    this.$emit('loaded');
  }
}
</script>

<style scoped>
.imgPreview {
  width: 200px;
  height: 200px;
}

.modLink {
  width: 200px;
  height: 58px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>