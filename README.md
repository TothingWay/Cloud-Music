## Cloud-Music

<p>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-16.13.1-blue" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3.7.2-blue" alt="TypeScript"></a>
  <a href="https://redux.js.org/"><img src="https://img.shields.io/badge/Redux-7.1.9-blue" alt="Redux"></a>
  <a href="https://immerjs.github.io/immer/docs/introduction"><img src="https://img.shields.io/badge/Immer.js-7.0.5-blue" alt="Immer"></a>
  <a href="https://choosealicense.com/licenses/mit/"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

TypeScript + React Hooks + Redux + Immer.js 实现移动端 webapp

## 功能介绍

* 歌曲音乐
    * 播放
    * 倍速播放
    * 暂停
    * 上一曲
    * 下一曲
    * 播放模式切换
    * 播放进度条
    * 圆形mini进度条
    * 歌曲歌词显示
    * 歌词自动滚动
    * 播放列表显示
    * 添加到播放列表
* 歌手
    * 歌手榜
    * 歌手单曲
    * 歌手首字母筛选
    * 歌手地区筛选
    * 歌手种类筛选
* 搜索
    * 搜索提示
    * 热门搜索
    * 单曲搜索
    * 歌手搜索
    * 歌单搜索
* 排行榜
* 推荐歌单
* 下拉刷新（仿网易云音乐app下拉动态勾勒效果）
* 上拉加载 & 动画

## 环境要求

建议 NodeJS 12+ 环境

## 安装

```shell
$ git clone --recursive https://github.com/TothingWay/Cloud-Music.git
$ cd Cloud-Music
$ git submodule update
$ npm install 
$ cd NeteaseCloudMusicApi
$ npm install
$ cd ../
```

## 运行

```shell
$ npm start  // api默认端口：3300，项目默认端口：3000
```

## 构建

```shell
$ npm run build
```
