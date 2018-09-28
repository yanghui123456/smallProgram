// pages/mine/buy-author/buy-author.js
//获取应用实例
const app = getApp()
Page({
  data: {
    showCharge:false,
    showToast:false,
    inputVal:'',
    zsNum:0,
    back:''
  },

  onLoad: function (res) {
    // 是否显示充值记录 如果url没带参数就是{}
    if (JSON.stringify(res) !== "{}") {
      this.setData({
        back: res.back
      })
    }
  },
  // 购买授权
  rechargeMoney:function(e) {
    var that = this;
    // 授权个数需要大于0
    if (e.target.dataset.author <= '0' || e.target.dataset.author == '') {
      wx.showToast({
        title: '请输入授权个数',
        icon:'none',
        duration:2000
      })
      return
    } else {
      var params = {
        buyAuthorize: e.target.dataset.author, //授权个数
        presentAuthorize: 0, // 赠送授权个数
        unitPriceAuthorize: e.target.dataset.money, // 价格
        dateType:'1',// 0=年，1=月
        dateCount:'2' //几个月的授权
      };
      wx.request({
        url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/buy/broker/team',
        method: 'POST',
        data: params,
        header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
        success: function (res) {
          var data = res.data;
          if (data.businessCode === '0000') {
            //调微信支付
            wx.requestPayment({
              'timeStamp': data.data.timeStamp,
              'nonceStr': data.data.nonceStr,
              'package': data.data.package,
              'signType': 'MD5',
              'paySign': data.data.paySign,
              'success': function (res) {
                console.log(res);
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                  duration: 2000
                })
                // 注意：从注册团队版-到购买授权页面，支付成功后跳转至团队版支付成功页面
                if (that.data.back == 0) { // 从团队版注册流程走到授权页面，支付成功进入授权成功页面
                  wx.navigateTo({
                    url: '../../team/open-team-success/open-team-success',
                  })
                } else {
                  wx.navigateTo({
                    url: '../../mine/mine-team/mine-team',
                  })
                }
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          } else if (data.businessCode === '0000') {
            app.getSessionKey(that.rechargeMoney());
          } else {
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    }
  },
  goRechargeNotes:function() {
    wx.navigateTo({
      url: '../mine-recharge-notes/mine-recharge-notes',
    })
  },
  zdy:function() {
    this.setData({
      showToast: !this.data.showToast,
      inputVal:'',
      zsNum:0
    })
  },
  inputNum:function(e) {
    // 赠送的个数是 授权个数的百分之20取整
    console.log(Math.ceil(e.detail.value * 0.2))
    this.setData({
      inputVal: e.detail.value,
      zsNum: Math.ceil(e.detail.value * 0.2)
    })
    // if (this.data.zsNum + '' == 'NaN') {
    //   this.setData({
    //     zsNum:0
    //   })
    // }
    console.log('输入授权数===' + this.data.inputVal);
    console.log('赠送授权数===' + this.data.zsNum);
  },
  buy:function() {
    //  if (isNaN(e.detail.value) == false) {
      // 输入的时候判断是否是数字类型 isNaN() true-非数字 false-数字类型（包括空格）
  }
})