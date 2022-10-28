<template>
  <div>
    <home-app v-if="isApp"/>
    <home-web v-if="!isApp"/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import HomeApp from './HomeApp.vue';
import HomeWeb from './HomeWeb.vue';

export default {
  name: 'HelloWorld',
  components: {
    HomeApp,
    HomeWeb,
  },
  computed: {
    ...mapGetters(['isApp'])
  }
}
</script>
