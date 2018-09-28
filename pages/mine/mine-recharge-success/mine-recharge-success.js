//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    htb: '',
    money: '',
    payTime:'',
    orderNumber:''
  },
  // 页面加载
  onLoad: function (res) {
    this.setData({
      htb: res.htb,
      money: res.money,
      orderNumber:res.orderId,
      payTime: res.nowTime
    })
  }
})
