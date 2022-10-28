<template>
  <el-badge v-show="mod.show" shadow="hover" :value="$t(`message.common.update_label`)" type="success" class="verbose-badge"
            :hidden="!mod.hasUpdate">
    <el-card :body-style="{ padding: '0px' }"
             :class="mod.isDisabled ? 'mod-card mod-card-disabled' : 'mod-card'"
             :style="mod.hasUpdate ? 'border-color: var(--el-color-success)' : ''">
      <img v-lazy="{src: mod.preview}" class="image"/>
      <el-tag v-if="mod.isDisabled" size="small" type="info" style="position: absolute; top: 4px; left: 24px">
        {{ $t(`message.common.disabled_label`) }}
      </el-tag>
      <mod-category-input :value="mod.category" @category-changed="categoryChanged"/>
      <div class="bottom" style="position: relative; padding: 14px">
        <el-button text type="primary" class="title" @click="showDetails">{{ mod.name }}</el-button>
        <el-button-group size="default">
          <el-tooltip class="box-item" effect="dark" :content="$t(`message.common.remove_label`)" placement="bottom">
            <el-button type="danger" plain @click.stop="blur($event);wantToRemove()">
              <template #icon>
                <i class="fa-duotone fa-trash-can"></i>
              </template>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="!mod.isDisabled" class="box-item" effect="dark" :content="$t(`message.common.disable_label`)" placement="bottom">
            <el-button type="warning" plain
                       :disabled="mod.isInstalling" @click.stop="blur($event);wantToDisable()">
              <template #icon>
                <i class="fa-duotone fa-power-off"></i>
              </template>
            </el-button>
          </el-tooltip>
          <el-tooltip v-else class="box-item" effect="dark" :content="$t(`message.common.enable_label`)" placement="bottom">
            <el-button type="warning" plain :disabled="mod.isInstalling"
                       @click.stop="blur($event);enable()">
              <template #icon>
                <i class="fa-duotone fa-power-off"></i>
              </template>
            </el-button>
          </el-tooltip>
          <el-button v-if="mod.isInstalling" type="info" plain loading></el-button>
          <el-tooltip v-else-if="mod.hasUpdate && mod.ignoreUpdateUntil != null"
                      class="box-item" effect="dark" :content="$t(`message.common.unignore_update_until_next_one`)" placement="bottom">
            <el-button type="success" plain @click.stop="blur($event);unignore()">
              <template #icon>
                <i class="fa-duotone fa-check"></i>
              </template>
            </el-button>
          </el-tooltip>
          <el-tooltip v-else class="box-item" effect="dark" :content="$t(`message.common.update_label`)" placement="bottom">
            <el-button type="success" plain :disabled="!mod.hasUpdate" @click.stop="blur($event);askUpdate()">
              <template #icon>
                <i class="fa-duotone fa-download"></i>
              </template>
            </el-button>
          </el-tooltip>
        </el-button-group>
      </div>
    </el-card>
  </el-badge>
</template>

<script>
import ModCategoryInput from "@/components/ui/ModCategoryInput.vue";

export default {
  name: "InstalledModItem",
  components: {ModCategoryInput},
  props: {
    mod: {
      type: Object,
      required: true
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
    wantToRemove: function () {
      this.$emit('want-to-remove', this.mod);
    },
    wantToDisable: function () {
      this.$emit('want-to-disable', this.mod);
    },
    showDetails: function() {
      this.$emit('show-details', this.mod);
    },
    askUpdate: function() {
      this.$emit('ask-update', this.mod);
    },
    categoryChanged: function(category) {
      console.log(`${this.mod.id} -> ${category}`);
      window.ipcRenderer.send('edit-mod', {
        id: this.mod.id,
        params: {category: category},
      });
    },
    unignore: function () {
      window.ipcRenderer.send('unignore-mod', {id: this.mod.id});
    },
    enable: function () {
      window.ipcRenderer.send('enable-mod', {
        id: this.mod.id,
        name: this.mod.name
      });
    }
  }
}
</script>

<style scoped>
.title {
  display: block;
  width: 100%;
}

.mod-card {
  width: 250px;
  margin-left: 20px;
  margin-bottom: 20px;
}

.mod-card-disabled > * > img {
  filter: grayscale(100%);
}

.mod-card-disabled {
  background-color: #e7e7e7 !important;
  border-color: lightgray;
}

.bottom {
  line-height: 12px;
  display: block;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  text-overflow: ellipsis;
}

.image {
  width: 100%;
  height: 170px;
  object-fit: cover;
  display: block;
}
/*
.fade {
  position: absolute;
  background-image: linear-gradient(to right, transparent, var(--el-color-white));
  height: 30px;
  width: 20%;
  top: 12px;
  left: 80%;
}

.mod-card-disabled .fade {
  background-image: linear-gradient(to right, transparent, #e7e7e7) !important;
}
 */
</style>