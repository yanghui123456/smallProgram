//index.js
//获取应用实例
const app = getApp()

Page({
  onShareAppMessage: function (res) {
    var that = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
          return {
            title: '有一个属于您的专属红包，快快来领取啦!',
            path: '/pages/trusteeship/single-red-paket/single-red-paket?brokerId=' + app.globalData.agentInfo.id + '&userId=' + app.globalData.whUserId + '&htb=' + that.data.htb + '&serverIp=' + app.globalData.severIp + '&giftId=' + that.data.giftId, // 用户领取成功后的页面
            imageUrl: 'http://oss.baoxian.xujinkeji.com/broker/send-has-red.jpg',
            success: function (res) {
              // 转发成功
              that.hideModel();
              that.setData({
                htb: '',
                showArea: true
              })
              // that.getNowTime();
              // that.addWeihuNotes();
            },
            fail: function (res) {
              // 转发失败
              wx.showToast({
                title: '转发失败',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                showArea: true,
                bigHtb:false,
                showPlaceholder: true,
                htb:''
              })
              that.hideModel();
              that.shareErr();
            }
          }
      }
  },
  data: {
    htb: '',
    content:'',
    allHtb: '',
    nowTime:'',
    giftId: '',
    bigHtb:false,
    showModel:false,
    showArea:true,
    showPlaceholder:true
  },
  //事件处理函数
  onLoad: function () {
    this.getHtbNum();
  },
  shareErr:function() {
    var that = this;
    var params = {
      brokerGiftId: that.data.giftId
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/oneRedEnvelope/sendCancel',
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.shareErr());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  getHtbNum:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/oneRedEnvelope/query/brokerDolphinCoinCount/' + app.globalData.agentInfo.id,
      method: 'GET',
      header: {'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            allHtb: data.data.dolphinCoin
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getHtbNum());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  htbInput: function (e) {
    this.setData({
      htb: e.detail.value
    })
    // 海豚币大于总海豚币或者小于0
    if (e.detail.value > this.data.allHtb || e.detail.value <= 0) {
      this.setData({
        bigHtb:false
      })
    } else if (e.detail.value.indexOf('1') == -1 && e.detail.value.indexOf('2') == -1 && e.detail.value.indexOf('3') == -1 && e.detail.value.indexOf('4') == -1 && e.detail.value.indexOf('5') == -1 && e.detail.value.indexOf('6') == -1 && e.detail.value.indexOf('7') == -1 && e.detail.value.indexOf('8') == -1 && e.detail.value.indexOf('9') == -1 && e.detail.value.indexOf('.') == -1) {
      // 海豚币全部是0的时候
      this.setData({
        bigHtb: false
      })
    } else if ((e.detail.value.split('.')).length - 1 > 1 || e.detail.value.substring(0, 1) === '.') {
      // 小数点出现的次数
      this.setData({
        bigHtb: false
      })
    } else {
      this.setData({
        bigHtb: true
      })
    }
  },
  saiHtb:function() {
    this.getRedPaket();
  },
  hideModel:function() {
    this.setData({
      showModel: !this.data.showModel
    })
  },
  cancelShare:function() {
    this.setData({
      showArea: true,
      showPlaceholder:true,
      htb: '',
      bigHtb:false
    })
    this.shareErr();
    this.hideModel();
    console.log(this.data.htb);
  },
  bigHtb:function() {
    if (this.data.htb === '') {
      wx.showToast({
        title: '海豚币不可为空',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (this.data.htb.indexOf('1') == -1 && this.data.htb.indexOf('2') == -1 && this.data.htb.indexOf('3') == -1 && this.data.htb.indexOf('4') == -1 && this.data.htb.indexOf('5') == -1 && this.data.htb.indexOf('6') == -1 && this.data.htb.indexOf('7') == -1 && this.data.htb.indexOf('8') == -1 && this.data.htb.indexOf('9') == -1 && this.data.htb.indexOf('.') == -1) {
      wx.showToast({
        title: '海豚币输入有误',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (this.data.htb <= '0') {
      wx.showToast({
        title: '海豚币数量不可小于0',
        icon: 'none',
        duration: 2000
      })
      return
    } else if ((this.data.htb.split('.')).length - 1 > 1 || this.data.htb.substring(0, 1) === '.') {
      wx.showToast({
        title: '海豚币输入有误',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      wx.showToast({
        title: '海豚币数量不足',
        icon: 'none',
        duration: 2000
      })
      return
    }
  },
  contenInput:function(e) {
    if (e.detail.value === '') {
      this.setData({
        showPlaceholder: true,
        content:''
      })
    } else {
      this.setData({
        showPlaceholder: false,
        content: e.detail.value
      })
    }
  },
  recharge:function() {
    wx.navigateTo({
      url: '../../mine/mine-recharge/mine-recharge',
    })
  },
  getRedPaket:function() {
    // 获取礼物id
    var that = this;
    var params = {
      brokerId: app.globalData.agentInfo.id,
      userId: app.globalData.whUserId,
      content:that.data.content,
      dolphinCoin:that.data.htb
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/oneRedEnvelope/send',
      method: 'POST',
      data:params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 发送成功到下一个页面 经纪人id,客户id,海豚币、severIp
          // 添加客户维护记录
          that.setData({
            giftId:data.data,
            showArea:false
          })
          that.hideModel();
          // wx.navigateTo({
          //   url: '../../trusteeship/single-red-paket/single-red-paket?brokerId=' + app.globalData.agentInfo.id + '&userId=' + app.globalData.whUserId + '&htb=' + that.data.htb + '&serverIp=' + app.globalData.severIp + '&giftId=' + that.data.giftId,
          // })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getRedPaket());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })
  },
  getNowTime: function () {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    this.setData({
      nowTime: year + '-' + month + '-' + day + '-' + hour + ':' + minute + ':' + second
    })
  },
  addWeihuNotes: function () {
    var that = this;
    var params = {
      vindicateTime: that.data.nowTime,
      type: 3,
      userId: app.globalData.whUserId,
      brokerId: app.globalData.agentInfo.id
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customer/add',
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          wx.navigateBack({
            delta: 1
          });
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.addWeihuNotes());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
      }
    })
  }
})
