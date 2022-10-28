<template>
  <div>
    <el-row v-for="nb in rows" :key="nb">
      <el-col v-for="col in cols" :key="nb + '-' + col" :span="24 / cols">
        <el-tooltip :content="getTooltip(nb, col)">
          <el-avatar shape="square" :size="Math.round(h / rows)" style="margin-left: 2px" @error="() => true"
                     :src="getImg(nb, col)">
            <el-image src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" lazy
                      :style="`width: ${Math.round(h / rows)}px;height: ${Math.round(h / rows)}px`"/>
          </el-avatar>
        </el-tooltip>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AvatarGrid",
  props: {
    content: {
      type: Array,
      required: true
    },
    rows: {
      type: Number,
      default() {
        return 3;
      }
    },
    cols: {
      type: Number,
      default() {
        return 3;
      }
    },
    h: {
      type: Number,
      default() {
        return 200;
      }
    },
  },
  methods: {
    getImg: function (row, col) {
      let position = (row - 1) * this.cols + (col - 1);
      if (position < this.content.length) {
        return this.content[position].img;
      }
      return "null";
    },
    getTooltip: function(row, col) {
      let position = (row - 1) * this.cols + (col - 1);
      if (position < this.content.length) {
        return this.content[position].tooltip;
      }
      return "";
    }
  }
}
</script>

<style scoped>

</style>