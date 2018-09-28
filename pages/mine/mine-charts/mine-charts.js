// pages/mine/mine-charts/mine-charts.js
let Charts = require('../../../utils/wxcharts.js');
//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
   
  },
  onLoad: function () {
    // 饼图
    new Charts({
      canvasId: 'canvas1',
      type: 'pie',
      series: [{ name: '一班', data: 50 }, { name: '二班', data: 30 }, { name: '三班', data: 20 }, { name: '四班', data: 18 }, { name: '五班', data: 8 }, { name: '六班', data: 8 }],
      width: 375,
      height: 200,
      dataLabel: true, //指示线数据的占比
      legend:true // 各类的标识
    });
    new Charts({
      canvasId: 'canvas2',
      type: 'pie',
      series: [{ name: '一班', data: 50 }, { name: '二班', data: 30 }, { name: '三班', data: 20 }, { name: '四班', data: 18 }, { name: '五班', data: 8 }],
      width: 187.5,
      height: 200,
      dataLabel: true, //指示线数据的占比
      legend: false // 各类的标识
    });
  },

  onShow: function () {
  
  }
})
