<template>
  <div>
    <el-tag size="small" v-if="categoryValue != null && categoryValue !== ''" closable @close="tagDeleted">
      {{ categoryValue.substring(0, Math.min(categoryValue.length, 20)) }}
    </el-tag>
    <el-button v-else-if="!displayInput" type="primary" plain size="small" style="padding: 0 5px; min-height: 20px;"
               @click.stop="displayInput = true" :disabled="!enabled">
      {{ $t(`message.common.add_tag`) }}
    </el-button>
    <el-select v-else size="small" allow-create filterable v-model="categoryValue" style="width: 180px"
               default-first-option :placeholder="$t(`message.common.type_or_select_a_tag`)" @change="tagSelected"
               class="select-input">
      <el-option
          v-for="item in modsCategories"
          :key="item"
          :label="item"
          :value="item"
      />
    </el-select>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "ModCategoryInput",
  emits: ["category-changed"],
  props: {
    value: {
      type: String
    },
    enabled: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
  data: function () {
    return {
      categoryValue: '',
      displayInput: false,
    }
  },
  computed: {
    ...mapGetters(['modsCategories'])
  },
  methods: {
    tagSelected: function () {
      this.displayInput = false;
      this.$emit('category-changed', this.categoryValue);
    },
    tagDeleted: function () {
      this.categoryValue = '';
      this.$emit('category-changed', this.categoryValue);
    }
  },
  mounted() {
    this.categoryValue = this.value;
  }
}
</script>

<style>
.select-input .el-input__wrapper {
  background-color: var(--el-color-primary-light-9) !important;
}
</style>
