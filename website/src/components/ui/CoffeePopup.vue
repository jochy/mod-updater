<template>
  <el-dialog v-model="showDialog" :title="$t(`message.app.coffee_time.title`)" :top="top()" @close="close"
             :close-on-click-modal="false" :show-close="false" :width="width()">
    <div style="text-align: right">
      <iframe style="width: 100%; border: none; height: 60vh"
              src="https://www.buymeacoffee.com/widget/page/joch?description=Support%20me%20on%20Buy%20me%20a%20coffee!&color=%235F7FFF"/>
      <p style="text-align: justify; word-break: break-word;">
        {{ $t(`message.app.coffee_time.desc`) }}
      </p>
      <el-button type="info" plain @click="close">{{$t(`message.common.close_button`)}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "CoffeePopup",
  data: function () {
    return {
      showDialog: this.modelValue
    }
  },
  methods: {
    close() {
      this.showDialog = false;
      this.$emit('update:modelValue', false);
    },
    width() {
      if (window.innerWidth < 600) {
        return '100%';
      } else {
        return '60%';
      }
    },
    top() {
      if (window.innerWidth < 600) {
        return '0';
      } else {
        return '2vh';
      }
    }
  },
  mounted() {
    this.showDialog = this.modelValue
  }
}
</script>
