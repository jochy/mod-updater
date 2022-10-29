<template>
  <div>
    <el-space style="margin-bottom: 20px" wrap>
      <el-input style="width: 200px"
                v-model="filters.text"
                :placeholder="$t('message.common.filter_label')"
                size="large"
                :clearable="true">
        <template #prefix>
          <i class="fa-duotone fa-magnifying-glass" style="line-height: 40px"></i>
        </template>
      </el-input>
      <multiple-select :placeholder="$t('message.mods.category')" :possible-values="modsCategories"
                       v-model="filters.category" size="large" :allow-undefined="true" :translate="false"
                       @input="(val) => filters.category = val"/>
      <multiple-select :placeholder="$t('message.mods.state')" :possible-values="['Enabled', 'Disabled']"
                       v-model="filters.state" size="large" @input="(val) => filters.state = val"/>
      <multiple-select style="width: 200px" :placeholder="$t('message.common.update_label')"
                       :possible-values="['No update', 'Update available', 'Update ignored']"
                       v-model="filters.update" size="large" @input="(val) => filters.update = val"/>
    </el-space>
  </div>
</template>

<script>
import MultipleSelect from "@/components/ui/MultipleSelect.vue";
import {mapGetters} from "vuex";

export default {
  name: "ModFilter",
  components: {MultipleSelect},
  data: function () {
    return {
      filters: {
        category: [],
        state: [],
        text: '',
        update: []
      },
      askingComputeScheduler: null
    }
  },
  watch: {
    filters: {
      handler: async function () {
        await this.$nextTick();
        this.askComputeResult();
      },
      deep: true
    },
    config: {
      handler: async function () {
        await this.$nextTick();
        this.askComputeResult();
      },
      deep: true
    },
    getInstalling: async function () {
      await this.$nextTick();
      this.askComputeResult();
    }
  },
  computed: {
    ...mapGetters(['config', 'updates', 'getInstalling', 'disableAds', 'modsCategories', 'hasPendingTask', 'disableAds']),
  },
  methods: {
    askComputeResult: function () {
      if (this.askingComputeScheduler == null) {
        this.askingComputeScheduler = setTimeout(() => this.computeResult(), 50);
      } else {
        console.log('Collapsing search requests');
      }
    },
    computeResult: async function () {
      this.askingComputeScheduler = null;

      let start = new Date().getTime();
      if (this.config == null || this.config.mods == null) {
        return;
      }

      let takeEnabled = this.filters.state.length === 0 || this.filters.state.includes('Enabled');
      let takeDisabled = this.filters.state.length === 0 || this.filters.state.includes('Disabled');
      let takeNoTag = this.filters.category.includes('Undefined');
      let takeNoUpdate = this.filters.update.length === 0 || this.filters.update.includes('No update');
      let takeUpdate = this.filters.update.length === 0 || this.filters.update.includes('Update available');
      let takeUpdateIgnored = this.filters.update.length === 0 || this.filters.update.includes('Update ignored');

      console.log(`Before filter in ${new Date().getTime() - start} ms`);

      let mods = this.config.mods
          .map(mod => {
            mod.hasUpdate = this.updates.find(it => it.id === mod.id) != null;
            mod.isInstalling = this.getInstalling.includes(mod.id);
            return mod;
          })
          .filter(mod => ((takeEnabled && !mod.isDisabled) || (takeDisabled && mod.isDisabled)) && (this.filters.category.length === 0 ||
                  (takeNoTag && (mod.category == null || mod.category === '') || this.filters.category.includes(mod.category)))
              && (this.filters.text == null || this.filters.text === ''
                  || mod.name.toLowerCase().includes(this.filters.text.toLowerCase()))
              && ((takeNoUpdate && !mod.hasUpdate)
                  || (takeUpdate && mod.hasUpdate)
                  || (takeUpdateIgnored && mod.ignoreUpdateUntil != null)
              ));

      console.log(`Filter in ${new Date().getTime() - start} ms with ${mods.length} elements left`);
      this.$emit('update:modelValue', Object.freeze(mods));
    }
  },
  mounted: function () {
    this.computeResult();
  }
}
</script>

<style scoped>

</style>