//获取应用实例
const app = getApp()
Page({
  data: {
    userInfo: '',
    timer: false,
    count: '',
    showTimer: true,
    telNum: '',
    telCode: ''
  },
  onLoad: function () {
    // 获取用户授权的头像、名称
    this.setData({
      userInfo: app.globalData.userInfo
    });
  },
  // 获取手机号码、验证码
  telNumInput: function (e) {
    this.setData({
      telNum: e.detail.value
    })
  },
  telCodeInput: function (e) {
    this.setData({
      telCode: e.detail.value
    })
  },
  // 完成按钮
  go_id_check: function (e) {
    var that = this;
    var reg = new RegExp(/^1\d{10}$/);
    if (that.data.telNum === '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 3000
      })
      return;
    } else if (that.data.telNum.length !== 11) {
      wx.showToast({
        title: '请输入11位手机号码',
        icon: 'none',
        duration: 3000
      })
      return;
    } else if (!reg.test(that.data.telNum)) {
      wx.showToast({
        title: '手机号码格式有误',
        icon: 'none',
        duration: 3000
      })
      return;
    } else if (that.data.telCode === '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 3000
      })
      return;
    } else {
      wx.showLoading({
        title: '加载中..',
      })
      var params = {
        phoneNo: that.data.telNum,
        verifyCode: that.data.telCode
      };
      wx.request({
        url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/confirm/register/code',
        method: 'POST',
        data: params,
        header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
        success: function (res) {
          if (res.data.businessCode === '0000') {
            wx.hideLoading();
            wx.navigateTo({
              url: '../2-perfect-msg/2-perfect-msg',
            })
            app.globalData.phoneNum = that.data.telNum;
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
            return;
          }
        }
      })
    }
  },
  // 获取验证码
  get_verification_code: function () {
    // 校验手机号码格式-》获取验证码接口
    var that = this;
    var reg = new RegExp(/^1\d{10}$/);
    if (that.data.telNum === '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 3000
      })
      return;
    } else if (that.data.telNum.length !== 11) {
      wx.showToast({
        title: '请输入11位手机号码',
        icon: 'none',
        duration: 3000
      })
      return;
    } else if (!reg.test(that.data.telNum)) {
      wx.showToast({
        title: '手机号码格式有误',
        icon: 'none',
        duration: 3000
      })
      return;
    } else {
      // 发送验证码接口
      var params = {
        phoneNo: that.data.telNum
      };
      wx.request({
        url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/send/register/code',
        method: 'POST',
        data: params,
        header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
        success: function (res) {
          if (res.data.businessCode === '0000') {
            that.setData({
              showTimer: false
            })
            that.timer_count_down();
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
  // 倒计时
  timer_count_down() {
    var that = this;
    var TIME_COUNT = 60;
    if (!that.data.timer) {
      that.setData({
        count: TIME_COUNT
      })
      setInterval(function () {
        if (that.data.count > 0 && that.data.count <= TIME_COUNT) {
          that.data.count--;
          that.setData({
            count: that.data.count--
          })
        } else {
          clearInterval(that.data.timer);
          that.setData({
            timer: false,
            showTimer: true
          })
        }
      }, 1000);
    }
  },
})
