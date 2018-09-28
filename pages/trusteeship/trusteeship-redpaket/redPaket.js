//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    num1: '',
    num2: '',
    allHtb:''
  },
  //事件处理函数
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    })
    this.availbleHtb();
  },
  num1Input:function(e) {
    this.setData({
      num1: e.detail.value
    })
  },
  num2Input: function (e) {
    this.setData({
      num2: e.detail.value
    })
  },
  recharge:function() {
    wx.navigateTo({
      url: '../../mine/mine-recharge/mine-recharge',
    })
  },
  // 经纪人可用海豚币
  availbleHtb:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/gift/api/v1.0.0/select/dolphincoin/count',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        console.log(data);
        if (data.businessCode === '0000') {
          that.setData({
            allHtb:data.data
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.availbleHtb());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
        wx.hideLoading();
      }
    })
  },
  goBack:function() {
    // 关闭当前页面回到上一个页面
    if (this.data.num1 === '') {
      wx.showToast({
        title: '请填写海豚币个数',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.num1 === '0') {
      wx.showToast({
        title: '海豚币个数不可为0',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.num1.substring(0, 1) === '.' || (this.data.num1.split('.')).length - 1 > 1) {
      wx.showToast({
        title: '海豚币输入有误',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.num1.indexOf('1') == -1 && this.data.num1.indexOf('2') == -1 && this.data.num1.indexOf('3') == -1 && this.data.num1.indexOf('4') == -1 && this.data.num1.indexOf('5') == -1 && this.data.num1.indexOf('6') == -1 && this.data.num1.indexOf('7') == -1 && this.data.num1.indexOf('8') == -1 && this.data.num1.indexOf('9') == -1 && this.data.num1.indexOf('.') == -1) {
      wx.showToast({
        title: '海豚币输入有误',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (this.data.num1 > this.data.allHtb) {
      wx.showToast({
        title: '可用海豚币数量不足',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.num2 === '') {
      wx.showToast({
        title: '请输入红包个数',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.num2 === '0') {
      wx.showToast({
        title: '红包个数不可为0',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.num2.substring(0, 1) === '0') { //防止输入多个0
      wx.showToast({
        title: '红包个数输入有误',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      wx.navigateBack({
        delta:1
      })
      app.globalData.hasRedPaket = true;
      app.globalData.paketNumber = this.data.num2;
      app.globalData.paketHtb = this.data.num1
    }
  }
})
