<template>
  <div v-loading="!singers.length" class="singer">
    <index-list :data="singers"></index-list>
  </div>
</template>

<script>
import { getSingerListRequest } from '@/api/singer.js'

import indexList from '@/components/indexList/index.vue'
export default {
  components: {
    indexList
  },
  data() {
    return {
      singers: []
    }
  },
  async created() {
    const result = await getSingerListRequest()
    this.singers = result
    console.log(result)
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
