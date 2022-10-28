<template>
  <div style="display: contents">
    <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="ml-1 w-20"
        size="small"
        style="width: 120px; margin-left: 5px"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput" style="margin-right: 3px; margin-left: 5px">
      + {{ $t(`message.common.new_tag_label`) }}
    </el-button>
    <el-tag
        v-for="tag in dynamicTags"
        :key="tag.tag"
        closable
        :type="tag.exclude ? 'danger' : 'success'"
        style="margin: 3px"
        :disable-transitions="false"
        @close="handleClose(tag)"
    >
      <el-button text class="ico-btn" @click="blur($event);invert(tag)">
        <i class="material-icons ico" v-if="!tag.exclude">filter_alt</i>
        <i class="material-icons ico" v-else>remove_circle_outline</i>
      </el-button>
      <span style="vertical-align: middle">{{ tag.tag }}</span>
    </el-tag>
  </div>
</template>

<script>
export default {
  name: "TagInput",
  props: {
    modelValue: {
      type: Array
    }
  },
  data: function () {
    return {
      inputVisible: false,
      inputValue: '',
      dynamicTags: this.modelValue,
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
    handleInputConfirm() {
      if (this.inputValue) {
        this.dynamicTags.push({tag: this.inputValue, exclude: false});
        this.$emit('input', this.dynamicTags);
        this.$nextTick(() => {
          this.$emit('modification');
        });
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.$emit('input', this.dynamicTags);
      this.$nextTick(() => {
        this.$emit('modification');
      });
    },
    invert(tag) {
      let t = this.dynamicTags[this.dynamicTags.indexOf(tag)];
      t.exclude = !t.exclude;
      this.$emit('input', this.dynamicTags);
      this.$nextTick(() => {
        this.$emit('modification');
      });
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.InputRef.focus();
      });
    }
  }
}
</script>

<style scoped>
.ico {
  vertical-align: middle;
  font-size: 18px;
  position: relative;
  margin-right: 5px;
  margin-left: -5px;
}
.ico-btn {
  padding: 0;
  line-height: 12px;
  min-height: 12px !important;
  color: inherit;
  background-color: transparent !important;
}
.ico-btn:hover {
  color: var(--el-color-primary);
  background-color: transparent !important;
}
</style>