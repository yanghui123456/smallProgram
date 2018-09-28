//index.js
//获取应用实例
const app = getApp()
const util = require('../../../utils/util.js');
Page({
  data: {
    // 是否有托管记录
    showList: false,
    trusteeshipLists:[]
  },
  // 页面加载
  onLoad: function (res) {
    this.getDetail();
  },
  getDetail:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/trusteeshipInfo/query/' + app.globalData.agentInfo.id,
      method: 'GET',
      header: { 'openid': app.globalData.openId },
      success: function (res) {
        if (res.data.businessCode === '0000') {
          // 判断数组长度是否为0
          if (res.data.data.length === 0) {
            that.setData({
              trusteeshipLists: res.data.data,
              showList: false
            })
          } else {
            // 时间格式化
            for (var i = 0; i < res.data.data.length; i++) {
              res.data.data[i].giftIssueTime = util.formatTime(new Date(res.data.data[i].giftIssueTime));
            }
            that.setData({
              trusteeshipLists: res.data.data,
              showList: true
            })
          }
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(that.getDetail());
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })
  }
})
