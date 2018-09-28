// pages/mine/team-detail/team-detail.js
//获取应用实例
const app = getApp()
Page({
  data: {
    // 经纪人信息
    imgUrl:'',
    name:'',
    tel:'',
    kh:'',
    bd:'',
    cd:'',
    showList:false,
    // 经纪人下的用户列表
    list:''
  },
  onLoad: function (options) {
    console.log(app.globalData.managerRoleBrokerData);
    this.setData({
      list: app.globalData.managerRoleData,
      imgUrl: app.globalData.managerRoleBrokerData.img,
      name: app.globalData.managerRoleBrokerData.name,
      tel: app.globalData.managerRoleBrokerData.tel,
      kh: app.globalData.managerRoleBrokerData.kh,
      bd: app.globalData.managerRoleBrokerData.bd,
      cd: app.globalData.managerRoleBrokerData.cd
    })
    if (this.data.list == '') {
      this.setData({
        showList: true
      })
    } else {
      this.setData({
        showList:false
      })
    }
  },
  callPhone:function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel
    })
  }
})