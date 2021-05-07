<template>
  <Header></Header>
  <Tab></Tab>
  <router-view></router-view>
</template>

<script>
import Header from '@/components/Header/index.vue'
import Tab from '@/components/Tab/index.vue'
export default {
  components: {
    Header,
    Tab
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped></style>
