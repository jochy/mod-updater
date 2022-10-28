<template>
  <el-select
      v-model="selected"
      multiple
      collapse-tags
      :placeholder="placeholder"
      @change="select"
      @remove-tag="remove"
      style="width: 160px"
  >
    <el-option
        v-for="item in allValues"
        :key="item"
        :label="label(item)"
        :value="item"
    />
  </el-select>
</template>

<script>
export default {
  name: "MultipleSelect",
  props: {
    modelValue: {
      type: Array,
    },
    possibleValues: {
      type: Array,
      required: true
    },
    allowUndefined: {
      type: Boolean,
      default() {
        return false;
      }
    },
    placeholder: {
      type: String,
      required: true
    },
    translate: {
      type: Boolean,
      required: false,
      default() {
        return true;
      }
    }
  },
  data: function () {
    return {
      selected: this.modelValue,
      previousSelected: []
    }
  },
  computed: {
    allValues: function () {
      if (this.allowUndefined) {
        return ['All', ...this.possibleValues, 'Undefined'];
      }
      return ['All', ...this.possibleValues];
    }
  },
  methods: {
    select: function () {
      if (this.selected.includes('All')) {
        this.selected = this.allValues;
      } else if (this.previousSelected.includes('All') && !this.selected.includes('All')) {
        this.selected = [];
      }
      this.$emit('input', this.selected);
      this.previousSelected = this.selected;
    },
    remove: function (val) {
      if (val === 'All') {
        this.selected = [];
      }
      this.$emit('input', this.selected);
    },
    label: function (item) {
      if (item === 'Undefined' && this.allowUndefined) {
        return this.$t(`message.common.multiple_select.undefined`);
      }
      if (item === 'All' && this.allValues) {
        return this.$t(`message.common.multiple_select.all`);
      }
      if (!this.translate) return item;
      let key = item.replaceAll(' ', '_').toLowerCase();
      return this.$t(`message.common.multiple_select.${key}`);
    }
  }
}
</script>
