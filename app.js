// app.js
var fetchWechat = require('fetch-wechat');
import * as tf from '@tensorflow/tfjs-core';
import * as webgl from '@tensorflow/tfjs-backend-webgl'
const plugin = requirePlugin('tfjsPlugin')
const ENABLE_DEBUG = true
App({
  onLaunch() {
    plugin.configPlugin({
      // polyfill fetch function
      fetchFunc: fetchWechat.fetchFunc(),
      // inject tfjs runtime
      tf,
      // inject webgl backend
      webgl,
      // provide webgl canvas
      canvas: wx.createOffscreenCanvas()
    }, ENABLE_DEBUG);
  }
})
