<template>
  <div style="display: none">
    <div v-if="installModId != null">
      <install-button ref="installModButton" @quick-install-changed="++quickInstallPopupCounter"></install-button>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import InstallButton from "../ui/InstallButton.vue";
import Backend from "../../backend.js";

export default {
  name: "QueueHandler",
  components: {InstallButton},
  data: function () {
    return {
      currentLink: null,
      installModId: null,
      quickInstallPopupCounter: 0
    }
  },
  computed: {
    ...mapGetters(['linkQueue']),
  },
  watch: {
    linkQueue: function () {
      this.handleLink();
    }
  },
  methods: {
    ...mapMutations(['popLinkFromQueue']),
    handleLink: async function () {
      if (this.currentLink != null) {
        return;
      }

      // Retrieve link
      this.currentLink = this.popLinkFromQueue();

      // Throw it away if wrong
      if (this.currentLink == null || this.currentLink === "") {
        await this.$nextTick();
        this.currentLink = null;
        return this.handleLink();
      }

      // Handle link
      if (this.currentLink.includes('/mod/v1/')) {
        if (this.currentLink.endsWith('/')) {
          this.currentLink = this.currentLink.substring(0, this.currentLink.length - 1);
        }
        let id = this.currentLink.substring(this.currentLink.lastIndexOf('/') + 1);
        let _this = this;
        await Backend.getById(id)
            .then(doc => {
              _this.installModId = doc;
              return _this.$nextTick();
            })
            .then(() => _this.$refs.installModButton.askQuickInstall())
            .then(() => {
              let counter = _this.quickInstallPopupCounter;
              return new Promise(resolve => {
                while(true) {
                  if (_this.quickInstallPopupCounter != counter) {
                    return resolve();
                  }
                  setTimeout
                }
              })
            })
            .catch(err => console.error(err));
      }

      // Handle next link if needed
      await this.$nextTick();
      this.currentLink = null;
      if (this.linkQueue.length > 0) {
        this.handleLink();
      }
    }
  }
}
</script>

<style scoped>

</style>