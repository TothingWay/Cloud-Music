<template>
  <transition name="slide">
    <div class="user">
      <x-header :left-options="{backText: ''}" title="我喜欢"></x-header>

    </div>
  </transition>
</template>

<script>
import { XHeader } from 'vux'

export default {
  data () {
    return {
    }
  },
  components: {
    XHeader
  }
}
</script>
<style lang='scss' scoped>
.user {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background-color: #fff;
  &.slide-enter-active, &.slide-leave-active{
    transition: all 0.3s
  }
  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
  .vux-header /deep/{
    background-color: #374047;
    font-size: 16px;
    .vux-header-left .left-arrow {
      &:before {
        border-color: #fff !important;
        top: 7px;
      }
    }
    .vux-header-title {
      height: 38px;
    }
  }
}
</style>
