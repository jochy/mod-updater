<template>
  <el-button type="warning" @click="blur($event);install()" :plain="!detail || installPlain">
    <template #icon>
      <i class="fa-duotone fa-download"></i>
    </template>
    {{ $t(`message.common.install_with_app_button`) }}
  </el-button>
</template>

<script>
export default {
  name: "InstallWithAppButton",
  props: {
    document: {
      type: Object,
      required: true
    },
    detail: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data: function () {
    return {
      installPlain: this.detail
    }
  },
  methods: {
    blur: function (el) {
      if (el.target.tagName !== 'BUTTON' && el.target.parentElement.tagName === 'BUTTON') {
        el.target.parentElement.blur();
      } else {
        el.target.blur();
      }
    },
    install: function () {
      window.open(`mod-installer://${this.document.type}/v1/${this.document.id}`, '_blank');
    }
  },
  mounted() {
    const _this = this;
    this.scheduler = setInterval(function () {
      _this.installPlain = !_this.installPlain
    }, 1000);
  },
  unmounted() {
    clearInterval(this.scheduler);
  }
}
</script>

<style scoped>

</style>