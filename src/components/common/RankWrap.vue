<template>
  <div class="wrap">
    <div class="cover">
      <img v-lazy="imgUrl">
      <span class="updataTime" v-if="type==0">
        每天更新
      </span>
      <span class="updataTime" v-if="type==1">
        每周四更新
      </span>
      <span class="updataTime" v-if="type==2">
        实时更新
      </span>
      <span class="updataTime" v-if="type==3">
        每周五更新
      </span>
    </div>
    <ol class="preview">
      <li v-for="(item, index) in list" :key="index" v-if="index<3">
        {{index+1}}.
        {{item.name}} -
        <span v-for="(names, index2) in item.ar" :key="index2">
          {{names.name}}
        </span>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  /*
    @param imgUrl 封面图片地址
    @param updata 更新时间
    @param type   右下角更新时间模式  0：每天更新  1：每周四更新  2：实时更新  3：每周五更新
    @param list   歌曲列表
  */
  props: [
    'imgUrl',
    'type',
    'list'
  ]
}
</script>
<style lang='scss' scoped>
.wrap {
  height: 120px;
  margin-top: 2px;
  display: flex;
  align-items: center;
  -webkit-box-align: center;
  border-bottom: 1px solid #e5e5e5;
  .cover {
    width: 120px;
    height: 120px;
    position: relative;
    top: 1px;
    img {
      outline: 0;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .preview {
    width: calc(100% - 145px);
    padding-left: 10px;
    padding-right: 15px;
    height: 119px;
    font-size: 14px;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    font-size: 14px;
    li {
      position: relative;
      overflow: hidden;
      color: #999;
      line-height: 2.3;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  .updataTime {
    position: absolute;
    left: 5px;
    bottom: 3px;
    font-size: 12px;
    color: #fff;
  }
}
</style>
