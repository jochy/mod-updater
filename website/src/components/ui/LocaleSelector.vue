<template>
  <el-dropdown style="vertical-align: baseline">
    <span class="el-dropdown-link">
      <span :class="'fi fi-' + locale2class(locale)"></span>
      <el-icon class="el-icon--right">
         <el-icon class="el-icon--right"><i class="fa-duotone fa-angle-down"></i></el-icon>
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu v-for="l in $i18n.availableLocales" :key="l">
        <el-dropdown-item @click="selectLocale(l)"><span :class="'fi fi-' + locale2class(l)"></span></el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  name: "LocaleSelector",
  data: function () {
    return {
      locale: 'en'
    }
  },
  methods: {
    locale2class: function (locale) {
      switch (locale) {
        case 'en':
          return 'gb';
        case 'sv':
          return 'se';
        default:
          return locale
      }
    },
    selectLocale: function(locale) {
      this.locale = locale;
      this.$i18n.locale = locale;
      localStorage.setItem('locale', locale);
    }
  },
  mounted() {
    let browserLocale = navigator.language;
    if (browserLocale != null) {
      browserLocale = browserLocale.split('-')[0];
    }
    if (browserLocale == null || browserLocale.length === 0 || !this.$i18n.availableLocales.includes(browserLocale)) {
      browserLocale = 'en';
    }

    this.locale = localStorage.getItem('locale') != null ? localStorage.getItem('locale') : browserLocale;
    this.$i18n.locale = this.locale;
  }
}
</script>

<style scoped>

</style>