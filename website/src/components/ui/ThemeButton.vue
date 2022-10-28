<template>
  <div class="theme-btn">
    <el-switch
        v-model="theme"
        style="margin-left: 24px"
        :inline-prompt="true"
        :inactive-icon="icon"
        :active-icon="icon"
        inactive-color="var(--el-border-color-extra-light)"
        active-color="var(--el-border-color-extra-light)"
        active-value="dark"
        inactive-value="light"
        @change="adaptTheme"
    />
  </div>
</template>

<script>
import {shallowRef} from "vue";
import Moon from "@/components/ui/Moon.vue";
import Sunny from "@/components/ui/Sunny.vue";
import {mapMutations} from "vuex";

export default {
  name: "ThemeButton",
  data: function() {
    return {
      theme: localStorage.getItem('theme') != null ? localStorage.getItem('theme') : 'dark',
      Moon: shallowRef(Moon),
      Sunny: shallowRef(Sunny),
    }
  },
  computed: {
    icon: function() {
      return this.theme === 'light' ? this.Sunny : this.Moon;
    }
  },
  watch: {
    theme: function(newVal) {
      this.setTheme(newVal);
      localStorage.setItem('theme', newVal);
    }
  },
  methods: {
    ...mapMutations(['setTheme']),
    adaptTheme: function() {
      if (this.theme === 'light') {
        document.querySelector('html').classList.remove('dark');
      } else {
        document.querySelector('html').classList.add('dark');
      }
    }
  }
}
</script>

<style>
.theme-btn {
  display: inline-block;
}
.theme-btn .el-switch__action {
  background-color: transparent !important;
  color: transparent !important;
}
.theme-btn .el-switch__inner > i {
  padding: 2px !important;
  border-color: red !important;
  border-radius: 200px;
}
.theme-btn .el-switch__core {
  border-color: var(--el-text-color-disabled) !important;
}
</style>