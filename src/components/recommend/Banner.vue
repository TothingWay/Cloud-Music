<template>
  <swiper :list="banner" auto loop height="150px" dots-position="center"></swiper>
</template>

<script>
import { Swiper } from 'vux'
export default {
  props: ['banner'],
  components: {
    Swiper
  }
}
</script>
