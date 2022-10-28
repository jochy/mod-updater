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
    <div v-if="followedGroups != null && followedGroups.length > 0 && hide != null">
      <el-card class="box-card" v-for="group in followedGroups" :key="group.id" shadow="never"
               :body-style="hide[group.id] == null ? '' : hide[group.id] ? '' : 'display:none'">
        <template #header>
          <div class="card-header">
            <span>{{ group.title }}</span>
            <div>
              <el-button-group>
                <el-button type="danger" @click="askRemove($event, group.id)" plain>
                  <i class="fa-duotone fa-trash-can"></i>
                </el-button>
                <el-button v-if="authenticatedUser != null && group.creator === authenticatedUser.uid" type="warning"
                           plain
                           @click="() => {this.toEdit = group; this.showEditDialog = true;}">
                  <i class="fa-duotone fa-pen-to-square"></i>
                </el-button>
                <el-button type="info"
                           @click="hideGroup($event, group.id)"
                           plain>
                  <i class="fa-duotone fa-eye-slash"></i>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>
        <div style="text-align: left">
          <div style="width: calc(50% - 5px);display: inline-block;text-align:left;vertical-align: top;padding:5px">
            {{
              group.desc
            }}
          </div>
          <div
              style="display: inline-block;padding:5px;width: calc(50% - 20px);border-left: 1px solid var(--el-border-color)">
            <p v-for="mod in group.mods" :key="mod.id" class="text">
              <el-avatar shape="square" :size="50" :src="mod.preview"/>
              <span style="line-height: 50px; vertical-align: text-bottom; margin-left: 5px">
              <router-link :to="{ name: 'detail', params: { id: mod.id }}">
                  <el-button link type="primary" @click="">{{ mod.name }}</el-button>
                </router-link>
            </span>
            </p>
          </div>
        </div>
      </el-card>
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
import {mapGetters, mapMutations} from "vuex";
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "GroupMods",
  components: {
    NewGroupDialog
  },
  data: function () {
    return {
      showCreateDialog: false,
      showEditDialog: false,
      toEdit: null,
      hide: {}
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
    askRemove: function ($event, id) {
      this.blur($event);
      ElMessageBox.confirm(
          this.$t(`message.mods.group_remove_dialog.desc`),
          this.$t(`message.mods.group_remove_dialog.title`),
          {
            confirmButtonText: 'OK',
            cancelButtonText: this.$t(`message.common.cancel_button`),
            type: 'error',
          }
      )
          .then(() => window.ipcRenderer.send('group-removed', {id: id}))
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
    hideGroup: function ($event, gid) {
      this.blur($event);
      this.hide[gid] = this.hide[gid] != null ? !this.hide[gid] : false
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