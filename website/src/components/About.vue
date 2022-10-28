<template>
  <div>
    <h2>{{ $t(`message.about.title`) }}</h2>
    <h4 v-html="$t(`message.about.subtitle`)"/>
    <el-space direction="vertical" :fill="'fill'" style="width: 70%; margin: auto">
      <el-card class="left">
        <el-space :size="size">
          <div class="inline"><i class="fa-duotone fa-list-check img-about"></i></div>
          <div class="inline" v-html="$t(`message.about.goal`)"/>
        </el-space>
      </el-card>
      <el-card class="right">
        <el-space :size="size">
          <div class="inline"><i class="fa-duotone fa-magnifying-glass img-about"></i></div>
          <div class="inline" v-html="$t(`message.about.search`)"/>
        </el-space>
      </el-card>
      <el-card class="left">
        <el-space :size="size">
          <div class="inline"><i class="fa-duotone fa-download img-about"/></div>
          <div class="inline" v-html="$t(`message.about.update`)"/>
        </el-space>
      </el-card>
      <el-card class="right">
        <el-space :size="size">
          <div class="inline"><i class="fa-duotone fa-book-copy img-about"></i></div>
          <div class="inline" v-html="$t(`message.about.providers`)"/>
        </el-space>
      </el-card>
      <el-card class="left">
        <el-space :size="size">
          <div class="inline"><i class="fa-duotone fa-gift img-about"/></div>
          <div class="inline" v-html="$t(`message.about.free`)"/>
        </el-space>
      </el-card>
      <el-card class="right">
        <el-space :size="size">
          <div class="inline"><i class="fa-duotone fa-shield-keyhole img-about"/></div>
          <div class="inline" v-html="$t(`message.about.privacy`)"/>
        </el-space>
      </el-card>
      <el-card class="left">
        <el-space :size="size">
          <div class="inline"><i class="fa-duotone fa-copyright img-about"></i></div>
          <div class="inline" v-html="$t(`message.about.copyright`)"/>
        </el-space>
      </el-card>
    </el-space>
  </div>
</template>

<script>
export default {
  name: "About",
  data: function () {
    return {
      size: 30
    }
  },
  mounted() {
    window.updateTitleAndDescription('About Sims mods updater', 'About the sims mods updater and it lovely application that handles automatic updates on your The Sims 4 mods and CC.');
  }
}
</script>

<style scoped>
.img-about {
  font-size: 32px;
  color: var(--el-color-primary);
}

.inline {
  display: inline-block;
  text-align: justify;
}

.right {
  width: 60%;
  margin-left: auto;
  margin-right: 0;
}

.left {
  width: 60%;
}

@media screen and (max-width: 900px) {
  .right {
    width: 100%;
    margin-left: 0;
  }

  .left {
    width: 100%;
  }
}
</style>