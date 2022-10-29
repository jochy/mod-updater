<template>
  <div>
    <div style="margin-bottom: 10px; text-align: right">
      <el-link :underline="false" style="float: left" @click="displayHelp">
        <i class="material-icons">help_outline</i>
      </el-link>
      <el-button type="primary" plain @click="($event) => { this.toEdit = null ; this.openCreateNewGroup($event) }">{{
          $t(`message.mods.create_new_group_button`)
        }}
      </el-button>
    </div>
    <div v-if="followedGroups != null && followedGroups.length > 0">
      <mod-group-item :group="item" v-for="item in followedGroups" :key="item.id"
                      @edit-group="group => {this.toEdit = group; this.showEditDialog = true;}"
                      @remove-group="group => this.askRemove(group)"
      />
    </div>

    <div v-if="followedGroups.length === 0">
      <el-alert :title="$t(`message.mods.no_followed_groups_title`)" type="error" :closable="false" center>
        {{ $t(`message.mods.no_followed_groups_desc`) }}
      </el-alert>
    </div>

    <el-dialog v-model="showCreateDialog" :title="$t(`message.mods.create_new_group_dialog`)" width="60%" draggable
               :close-on-click-modal="false" top="5vh">
      <new-group-dialog @group-dialog-validated="groupValidated"/>
    </el-dialog>

    <el-dialog v-model="showEditDialog" :title="$t(`message.mods.edit_group_dialog`)" width="60%" draggable
               :close-on-click-modal="false" top="5vh">
      <new-group-dialog :to-edit="toEdit" @group-dialog-validated="groupValidated"/>
    </el-dialog>
  </div>
</template>

<script>
import NewGroupDialog from "./NewGroupDialog.vue";
import ModGroupItem from './ModGroupItem.vue';
import {mapGetters, mapMutations} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "GroupMods",
  components: {
    NewGroupDialog, ModGroupItem
  },
  data: function () {
    return {
      showCreateDialog: false,
      showEditDialog: false,
      toEdit: null,
    };
  },
  computed: {
    ...mapGetters(['config', 'authenticatedUser']),
    followedGroups: function () {
      if (this.config == null) return [];
      return this.config.groups;
    },
  },
  methods: {
    ...mapMutations(['askAuthentication']),
    blur: function (el) {
      if (el.target.tagName !== 'BUTTON' && el.target.parentElement.tagName === 'BUTTON') {
        el.target.parentElement.blur();
      } else {
        el.target.blur();
      }
    },
    openCreateNewGroup: function ($event) {
      if (this.authenticatedUser == null) {
        this.askAuthentication();
      } else {
        this.blur($event);
        this.showCreateDialog = true;
      }
    },
    askRemove: function (group) {
      ElMessageBox.confirm(
          this.$t(`message.mods.group_remove_dialog.desc`),
          this.$t(`message.mods.group_remove_dialog.title`),
          {
            confirmButtonText: 'OK',
            cancelButtonText: this.$t(`message.common.cancel_button`),
            type: 'error',
          }
      )
          .then(() => window.ipcRenderer.send('group-removed', {id: group.id}))
          .catch(() => console.log('Deleted canceled'));
    },
    displayHelp: function () {
      ElMessageBox.alert(
          this.$t(`message.mods.group_help_dialog.desc`),
          this.$t(`message.mods.group_help_dialog.title`),
          {
            dangerouslyUseHTMLString: true,
            confirmButtonText: 'OK',
            cancelButtonText: this.$t(`message.common.cancel_button`),
            type: 'info',
            draggable: true
          }
      )
    },
    groupValidated: function (group) {
      this.showCreateDialog = false;
      this.showEditDialog = false;
      ElMessage({
        message: this.toEdit != null ? this.$t(`message.mods.group_edited`) : this.$t(`message.mods.group_created`),
        type: 'success',
      });
      this.toEdit = null;
      window.ipcRenderer.send('group-upserted', group);
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
  text-align: left;
  margin: 0;
}

.box-card {
  width: calc(100% - 5px);
}
</style>