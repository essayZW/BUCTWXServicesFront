# BUCTWXServicesFront
BUCT轻触 小程序前端代码

# 全局主题适配指南

## 1. 关于全局主题适配

全局主题适配部分主要包括各个页面的顶栏部分的背景颜色和文字颜色，以及页面中与顶栏保持同步颜色的区域。

## 2. JS文件适配

在每一个页面的JS文件中的首行需要加入以下代码

```javascript
const App = getApp();
```

同时在`onLoad`函数中需要加入以下代码:

```javascript
// 修改本页面顶栏颜色
App.setNavigatorColor();
```

此外在`onShow`函数的**最后**加入以下代码：

> 最后是因为有的时候页面需要在该函数中处理一些页面渲染

```javascript
// 设置该页面主题色
App.setPageColor(this);
```

若不懂`onShow`和`onLoad`函数是啥的话，请参考已经适配的页面~~或者交由不会有任何怨言的乙方后期适配处理~~。

若有疑问可参考已经适配的页面~~或者交由不会有任何怨言的乙方后期适配处理~~。

## 3. WXML文件的适配

JS文件中是设置主题色，在这里需要处理接受主题色

将会在每个适配的页面中绑定两个变量

`globalBackgroundTheme` 背景颜色

`globalFrontTheme`前景颜色

使用WXML的数据绑定可以动态改变颜色

> 数据绑定参考:https://developers.weixin.qq.com/miniprogram/dev/reference/wxml/data.html

于是对于页面中需要使用动态颜色的地方，需要使用该数据绑定，将样式写在style中

例如:

```html
<view style="background-color: {{ globalBackgroundTheme }}; color: {{ globalFrontTheme }}"></view>
```

这样就对该元素设置了动态的背景颜色以及文字颜色

同时也可以设置任何颜色，比如边框颜色

```html
<!-- 来源于mine.wxml第1行 -->
<view class="bg" style="border-left-color: {{ globalBackgroundTheme }}"></view>
```

## 4. WXSS文件的适配

该文件没法做到动态变化，所以其最好是将WXML中动态变化颜色的原来的颜色设为白底黑字

