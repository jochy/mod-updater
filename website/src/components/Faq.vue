<template>
  <el-tabs>
    <el-tab-pane :label="$t(`message.common.faq_label`)">
      <div style="width: 90%; margin: auto">
        <el-collapse>
          <el-collapse-item :title="$t(`message.faq.how_does_it_works_title`)" name="1">
            <div class="text-answer" v-html="$t(`message.faq.how_does_it_works_desc`)"/>
          </el-collapse-item>
          <el-collapse-item :title="$t(`message.faq.is_it_legal_title`)" name="2">
            <div class="text-answer" v-html="$t(`message.faq.is_it_legal_desc`)"/>
          </el-collapse-item>
          <el-collapse-item :title="$t(`message.faq.can_i_modify_mods_title`)" name="2">
            <div class="text-answer" v-html="$t(`message.faq.can_i_modify_mods_desc`)"/>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-tab-pane>
    <el-tab-pane :label="$t(`message.common.contact_label`)">
      <contact/>
    </el-tab-pane>
    <el-tab-pane :label="$t(`message.common.about_label`)">
      <about/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import About from "@/components/About.vue";
import Contact from "@/components/Contact.vue";

export default {
  name: "Faq",
  components: {About, Contact},
  data: function() {
    return {
    }
  },
  mounted() {
    window.updateTitleAndDescription('Sims mods updater FAQ', 'Any question about Sims mods updater website or about the application that handles by itself any mod update? ');
  }
}
</script>

<style>
.el-collapse-item__header {
  padding-left: 10px !important;
  font-weight: bold;
}

.text-answer {
  text-align: justify;
  padding: 10px;
}
</style>