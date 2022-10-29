<template>
  <el-card class="box-card" shadow="never" :body-style="hide ? 'display:none' : ''">
    <template #header>
      <div class="card-header">
        <span>{{ group.title }}</span>
        <div>
          <el-button-group>
            <el-button type="danger" @click="($event) => {this.blur($event); this.$emit('remove-group', this.group)}" plain>
              <i class="fa-duotone fa-trash-can"></i>
            </el-button>
            <el-button v-if="authenticatedUser != null && group.creator === authenticatedUser.uid" type="warning"
                       plain @click="($event) => {this.blur($event); this.$emit('edit-group', this.group)}">
              <i class="fa-duotone fa-pen-to-square"></i>
            </el-button>
            <el-button type="info" @click="($event) => {this.blur($event); this.hide = !this.hide}" plain>
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
      <div style="display: inline-block;padding:5px;width: calc(50% - 20px);height:250px;border-left: 1px solid var(--el-border-color)">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2 ref="testing"
                         :columns="columns"
                         :data="group.mods"
                         :width="width"
                         :height="height"
                         :header-height="0"
                         :row-height="50"
                         :cache="0"
            />
          </template>
        </el-auto-resizer>
      </div>
    </div>
  </el-card>
</template>

<script lang="jsx">
import {mapGetters} from "vuex";

export default {
  name: "ModGroupItem",
  props: {
    group: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['authenticatedUser']),
  },
  data: function() {
    return {
      hide: false,
      columns: [
        {
          key: 'preview',
          width: 90,
          align: 'center',
          cellRenderer: (cellData) => <el-avatar shape="square" size={50} src={cellData.rowData.preview}/>
        },
        {
          key: 'name',
          width: 500,
          align: 'left',
          cellRenderer: (cellData) => {
            const to = { name: 'detail', params: { id: cellData.rowData.id }}
            return <router-link to={to}>
              <el-button link type="primary">{ cellData.rowData.name }</el-button>
            </router-link>
          },
        }
      ]
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
  margin-bottom: 5px;
}
</style>