//index.js
//获取应用实例
const app = getApp();
const util = require('../../../utils/util.js');
Page({
  data: {
    showXFnotes: false,
    xfNoteLists: []
  },
  // 页面加载
  onLoad: function (res) {
    // 海豚币消费记录
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/brokerDolphinCoinCostRecord/query/' + app.globalData.agentInfo.id,
      method: 'GET',
      header: {'openid': app.globalData.openId },
      success: function (res) {
        if (res.data.businessCode === '0000') {
          // 记录数组长度是否为0
          if (res.data.data === null) {
            that.setData({
              xfNoteLists: res.data.data,
              showXFnotes: false
            })
          } else {
            // 时间格式化
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].createTime = util.formatTime(new Date(res.data.data[i].createTime));
            }
            that.setData({
              xfNoteLists: res.data.data,
              showXFnotes: true
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
        wx.hideLoading();
      }
    })
  }
})
