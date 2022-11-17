<template>
  <el-button link type="info" @click="blur($event);copy()">
    <template #icon>
      <i class="fa-duotone fa-share-nodes"></i>
    </template>
    {{ $t(`message.common.copy_link_to_install_using_app`) }}
  </el-button>
</template>

<script>
import {ElMessage} from "element-plus";

export default {
  name: "CopyInstallLinkButton",
  props: {
    document: {
      type: Object,
      required: true
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
    copy: async function() {
      await navigator.clipboard.writeText(`mod-installer://${this.document.type}/v1/${this.document.id}`);
      ElMessage({
        message: this.$t(`message.common.link_copied`),
        type: 'success',
      })
    }
  }
}
</script>

<style scoped>

</style>