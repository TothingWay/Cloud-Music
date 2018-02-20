<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-bar" r="47" cx="51" cy="49" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 28
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset () {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>
<style lang="scss" scoped>
.progress-circle {
  position: relative;
  top: 2px;
  circle {
    stroke-width: 6px;
    transform-origin: center;
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: #2c3e50;
    }
  }
}
</style>
