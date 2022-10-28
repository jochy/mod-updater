<template>
  <div>
    <commit-mod-action v-if="isModCommit(commit)" :commit="commit"/>
    <commit-revert v-else-if="commit.msg.action === 'revert_change'" :commit="commit"/>
    <b style="font-size: 20px" v-else>
      {{ $t(`message.commit.${commit.msg.action}`) }}
    </b>
  </div>
</template>

<script>
import CommitModAction from "@/components/versioning/CommitModAction.vue";
import CommitRevert from "@/components/versioning/CommitRevert.vue";

export default {
  name: "Commit",
  components: {CommitModAction, CommitRevert},
  props: {
    commit: {
      type: Object,
      required: true
    }
  },
  methods: {
    isModCommit: (commit) => ['install_mod', 'delete_mod', 'update_mod'].includes(commit.msg.action)
  }
}
</script>

<style scoped>

</style>