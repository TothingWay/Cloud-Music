<template>
  <x-header>
    <i class="fa fa-music" slot="overwrite-left"></i>
    <!-- <img src="../assets/logo.svg" slot="overwrite-left" alt="logo" width="62"> -->
    <search
    slot="overwrite-title"
    @result-click="resultClick"
    @on-change="getResult"
    :results="results"
    v-model="value"
    position="absolute"
    @on-focus="onFocus"
    @on-cancel="onCancel"
    @on-submit="onSubmit"
    ref="search"></search>
    <a slot="right" class="record"><i class="fa fa-address-book-o"></i></a>
  </x-header>
</template>

<script>
import { XHeader, Search, Group, Cell } from 'vux'
export default {
  data () {
    return {
      results: [],
      value: ''
    }
  },
  components: {
    XHeader,
    Search,
    Group,
    Cell
  },
  methods: {
    setFocus () {
      this.$refs.search.setFocus()
    },
    resultClick (item) {
      window.alert('you click the result item: ' + JSON.stringify(item))
    },
    getResult (val) {
      console.log('on-change', val)
      this.results = val ? getResult(this.value) : []
    },
    onSubmit () {
      this.$refs.search.setBlur()
      this.$vux.toast.show({
        type: 'text',
        position: 'top',
        text: 'on submit'
      })
    },
    onFocus () {
      console.log('on focus')
    },
    onCancel () {
      console.log('on cancel')
    }
  }
}
function getResult (val) {
  let rs = []
  for (let i = 0; i < 20; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
  }
  return rs
}
</script>
<style lang='scss' scoped>
  .vux-header /deep/ {
    padding: 0;
    background-color: #374047;
    .vux-header-title-area {
      height: 44px;
      margin: 0 52px;
    }
    .vux-header-left{
      top: 10px;
      left: 15px;
      .fa-music {
        color: #fff;
        font-size: 22px;
      }
    }
    .vux-header-right {
      top: 10px;
      .record {
        color: #fff;
        font-size: 22px;
      }
    }
    .vux-header-title {
      color: #2c3e50;
      text-align: left;
    }
    .weui-search-bar {
      background-color: transparent;
      &:before,
      &:after {
        display: none;
      }
    }
    .weui-search-bar__form {
      background-color: transparent;
      &:after {
        border: none;
        border-radius: 50px;
      }
    }
    .weui-search-bar__input {
      border: none;
    }
    .weui-search-bar__label {
      border-radius: 50px;
    }
    .vux-search-fixed {
      background-color: #374047;
      .weui-search-bar {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .weui-search-bar__cancel-btn {
      color: #fff;
    }
    .weui-search-bar {
      padding-left: 0;
      padding-right: 0;
    }

  }
</style>
