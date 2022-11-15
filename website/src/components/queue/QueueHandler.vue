<template>
  <div>
    <div v-if="installModId != null && installModId.type === 'mod'">
      <install-button ref="installModButton" @quick-install-changed="++quickInstallPopupCounter"
                      :title="installModId.title" :document="installModId" :hidden="true"/>
    </div>
    <div v-if="installModId != null && installModId.type === 'group'">
      <group-install-button ref="groupInstallModButton" @quick-install-changed="++quickInstallPopupCounter"
                            :document="installModId" :hidden="true"/>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import InstallButton from "../ui/InstallButton.vue";
import GroupInstallButton from "../ui/GroupInstallButton.vue";
import Backend from "../../backend.js";

export default {
  name: "QueueHandler",
  components: {InstallButton, GroupInstallButton},
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
    linkQueue: {
      handler: function () {
        this.handleLink();
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['popLinkFromQueue']),
    handleLink: async function () {
      if (this.currentLink != null) {
        return;
      }

      // Retrieve link
      this.currentLink = "TMP"; // <- used to prevent others exec during promise resolving
      this.currentLink = await this.popLinkFromQueue();

      // Throw it away if wrong
      if (this.currentLink == null || this.currentLink === "") {
        await this.$nextTick();
        this.currentLink = this.popLinkFromQueue();
        if (this.currentLink == null || this.currentLink === "") {
          return;
        }
      }

      // Handle link
      if (this.currentLink.includes('/mod/v1/') || this.currentLink.includes('/group/v1/')) {
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
            .then(() => {
              if (_this.installModId.type === 'mod') {
                return _this.$refs.installModButton.askQuickInstall();
              } else {
                return _this.$refs.groupInstallModButton.askQuickInstall();
              }
            })
            .then(() => {
              let counter = _this.quickInstallPopupCounter;
              return new Promise(async resolve => {
                const interval = setInterval(() => {
                  if (_this.quickInstallPopupCounter != counter) {
                    clearInterval(interval);
                    return resolve();
                  }
                }, 100);
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