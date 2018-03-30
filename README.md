<p align="center">
    <a href="https://github.com/TothingWay/vue-music" target="_blank">
        <img width="300"src="http://p3ax469x0.bkt.clouddn.com/vue-music.svg">
    </a>
</p>
<p align="center">
    <a href="https://github.com/vuejs/vue-cli"><img src="https://img.shields.io/badge/vue--cli-v2.9.2-blue.svg" alt="vue-cli"></a>
    <a href="https://github.com/vuejs/vue"><img src="https://img.shields.io/badge/vue-v2.5.13-blue.svg" alt="vue"></a>
    <a href="https://github.com/vuejs/vue-router"><img src="https://img.shields.io/badge/vue--router-v3.0.1-blue.svg" alt="vue-router"></a>
    <a href="https://github.com/vuejs/vuex"><img src="https://img.shields.io/badge/vuex-v3.0.1-blue.svg" alt="vuex"></a>
    <a href="https://github.com/axios/axios"><img src="https://img.shields.io/badge/axios-0.17.1-blue.svg" alt="axios"></a>
    <a href="https://github.com/airyland/vux"><img src="https://img.shields.io/badge/vux-v2.7.8-blue.svg" alt="vux"></a>
    <a href="javascript:;"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="license"></a>
</p>
<p align="center">
    项目预览：<a href="http://101.132.76.13/music">http://101.132.76.13/music</a>
</p>
<p align="center">
    <img width="190" src="http://p3ax469x0.bkt.clouddn.com/newcode.png">
</p>

## 介绍
用vue制作的网页版音乐app

## 实现功能
* 音乐播放、暂停、上一曲、下一曲、播放进度条
* 歌曲歌词、歌词自动滚动
* 播放列表、添加到播放列表
* 播放模式切换
* 搜索提示、热门搜索、搜索历史记录、搜索单曲、歌手
* 排行榜
* 歌手榜、歌手单曲
* 推荐歌单
* 推荐最新音乐
* 轮播
* 我喜欢

## 项目截图
<p align="center">
    <img src="http://p3ax469x0.bkt.clouddn.com/remd.png" width="300">
    <img src="http://p3ax469x0.bkt.clouddn.com/player.png" width="300">
    <img src="http://p3ax469x0.bkt.clouddn.com/lyric.png" width="300">
    <img src="http://p3ax469x0.bkt.clouddn.com/remdList.png" width="300">
    <img src="http://p3ax469x0.bkt.clouddn.com/rank.png" width="300">
    <img src="http://p3ax469x0.bkt.clouddn.com/singer.png" width="300">
    <img src="http://p3ax469x0.bkt.clouddn.com/singerDetail.png" width="300">
    <img src="http://p3ax469x0.bkt.clouddn.com/search.png" width="300">
</p>

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
## 项目结构

<pre>
├── build                    // 构建服务和 webpack 配置
├── config            		 // 项目不同环境的配置
├── index.html          	 // 项目入口文件
├── package.json      		 // 项目配置文件
├── static       			 // 放置静态资源
├── src                		 // 生产目录
│   ├── api       			// api请求
│   ├── assets              // 公共的images, fonts， js资源
│   ├── components     		// 各种组件
│   ├── store               // vuex状态管理
│   ├── App.vue         	// 主页面
│   ├── router     		// 路由配置
│   └── main.js       	    // Webpack 预编译入口
</pre>

## 说明
* [API来源](https://github.com/Binaryify/NeteaseCloudMusicApi)
* 轮播banner，热门搜索使用了QQ音乐的banner数据
* 排行榜因调用了23次接口，所以加载会过慢
* 音乐播放：
    * ios下Safari、微信等大多数第三方浏览器音乐无法自动播放
    * ios下的手机QQ、Tim、QQ空间打开能正常播放
    * 安卓暂无发现问题

>    ios 下无法正常播放的原因是因为 Safari 浏览器禁止`<audio>`标签自动播放,而 iOS 中只允许使用 Safari 作为浏览器容器，所以造成其他第三方浏览器也无法正常播放。至于手机QQ等是如何做到的，猜测是它修改了浏览器沙盒的一些限制。

## 最后
* 感谢 [Binaryify](https://github.com/Binaryify/NeteaseCloudMusicApi) 提供给我的接口支持
* 感谢 [GitHub](https://github.com/)，让我能站在巨人的肩膀上
* 欢迎大家提issue，如果你有什么建议或者看到了项目中的不足之处请一定要给我留言。本项目仅供学校交流使用，如侵犯了第三方版权问题请联系我
* 你的 Star 是对我最大的鼓励，谢谢




