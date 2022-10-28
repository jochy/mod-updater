<template>
  <div>
    <iframe :src="url" :key="key"
            frameborder="0" marginheight="0" marginwidth="0" allowtransparency="true"
            style="width: 100%; height: 1900px; background-color: var(--el-bg-color)">Loading…
    </iframe>
  </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: "Status",
  data: function () {
    return {
      key: 0,
      scheduler: null
    }
  },
  computed: {
    ...mapGetters(['theme']),
    url: function () {
      return this.theme === 'light' ? 'https://status.sims-mods-updater.com/status/public' : 'https://status.sims-mods-updater.com/status/public-dark';
    }
  },
  methods: {
    newKey: function () {
      this.key = this.key + 1;
    }
  },
  mounted() {
    const _this = this;
    this.scheduler = setInterval(_this.newKey, 60000);
  },
  unmounted() {
    clearInterval(this.scheduler);
  }
}
</script>
