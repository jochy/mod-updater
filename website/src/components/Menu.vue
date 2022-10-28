<template>
  <el-menu
      :default-active="currentRouteName"
      class="el-menu-vertical-demo"
      :collapse="true"
      :router="true"
  >
    <el-menu-item index="/">
      <i class="fa-duotone fa-grid-2"></i>
      <template #title>{{ $t(`message.menu.home_menu_tooltip`) }}</template>
    </el-menu-item>
    <el-menu-item index="/groupmods" v-if="isApp">
      <el-badge type="success" is-dot :hidden="updates == null || updates.length === 0" class="menu-badge">
        <i class="fa-duotone fa-microchip"></i>
      </el-badge>
      <template #title>{{ $t(`message.menu.mods_menu_tooltip`) }}</template>
    </el-menu-item>
    <el-menu-item index="/issues" v-if="isApp">
      <el-badge type="danger" is-dot :hidden="issues == null || issues.length === 0" class="menu-badge">
        <i class="fa-duotone fa-flag-swallowtail"></i>
      </el-badge>
      <template #title>{{ $t(`message.menu.issues_menu_tooltip`) }}</template>
    </el-menu-item>
    <el-menu-item index="/versioning" v-if="isApp && config != null && config?.enableVersioning">
      <i class="fa-duotone fa-timeline-arrow"></i>
      <template #title>{{ $t(`message.menu.history_menu_tooltip`) }}</template>
    </el-menu-item>
    <el-menu-item index="/search">
      <i class="fa-duotone fa-magnifying-glass"></i>
      <template #title>{{ $t(`message.menu.search_menu_tooltip`) }}</template>
    </el-menu-item>
    <el-menu-item index="/config" v-if="isApp">
      <i class="fa-duotone fa-gears"></i>
      <template #title>{{ $t(`message.menu.settings_menu_tooltip`) }}</template>
    </el-menu-item>
    <el-menu-item index="/download" v-if="!isApp">
      <i class="fa-duotone fa-download"></i>
      <template #title>{{ $t(`message.menu.download_menu_tooltip`) }}</template>
    </el-menu-item>
    <el-menu-item index="/status">
      <el-badge type="danger" is-dot :hidden="getStatus == null || getStatus === true" class="menu-badge">
        <i class="fa-duotone fa-heart-pulse"></i>
      </el-badge>
      <template #title>{{ $t(`message.menu.status_menu_tooltip`) }}</template>
    </el-menu-item>
    <el-menu-item index="/faq">
      <i class="fa-duotone fa-circle-question"></i>
      <template #title>{{ $t(`message.menu.faq_contact_about_menu_tooltip`) }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: "Menu",
  computed: {
    ...mapGetters(['updates', 'issues', 'getStatus']),
    currentRouteName() {
      return this.$route.path;
    },
    ...mapGetters(['isApp', 'config'])
  }
}
</script>

<style scoped>
.el-menu {
  border-right: none;
}

.el-menu-item * {
  vertical-align: middle !important;
}
</style>