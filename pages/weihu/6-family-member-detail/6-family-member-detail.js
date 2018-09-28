//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasPolicy: false,
    showMask: false,
    noDetail: false,
    userId: '',
    familymemberId:'',
    paidMoney:'',
    unPaidMoney: '',
    insuranceList:''

  },
  // 页面加载
  onLoad: function (res) {
    // 上个页面url上传来的userid  和  家庭成员id  获取家庭成员的信息
    this.setData({
      userId: res.userId,
      familymemberId: res.id
    })
    this.detail();
  },
  detail:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customerMember/detail/query/' + that.data.familymemberId + '/' + that.data.userId + '/' + app.globalData.agentInfo.id,
      method: 'GET',
      header: {'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          if (data.data === '') {
            // 无数据
            that.setData({
              noDetail:true
            })
          } else if (data.businessCode === '0009') {
            app.getSessionKey(that.detail());
          }else {  
            // 有数据
            that.setData({
              noDetail: false,
              paidMoney: data.data.paidMoney,
              unPaidMoney: data.data.unPaidMoney,
              insuranceList: data.data.customerBillModels
            })
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.detail());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  checkWhMask:function() {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  goInsuranceDetail: function (e) {
    // 地址中待着billId
    wx.navigateTo({
      url: '../4-insurance-detail/4-insurance-detail?billId=' + e.target.dataset.id,
    })
  }
})
