//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    page:1,
    newCompantList:[],
    companyList:[],
    infoCompany: '',
    companyId: '',
    catalogSelect: '',
    inputVal:''
  },
  //事件处理函数
  onLoad: function () {
    this.httpCompanyList();
  },
  searchInput:function(e) {
    this.setData({
      inputVal:e.detail.value
    })
  },
  search:function() {
    console.log('我点击了完成');
    this.setData({
      page: 1,
      newCompantList:[]
    })
    this.httpCompanyList();
  },
  moreCompany:function() {
    this.setData({
      page: this.data.page + 1
    })
    this.httpCompanyList();
  },
  httpCompanyList:function() {
    var that = this;
    var param = {
      page: that.data.page,
      pageSize: 100,
      companyName: that.data.inputVal
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/company/api/v1.0.0/select/company/list',
      method: 'POST',
      data: param,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        if (res.data.businessCode === '0000') {
         if (res.data.data === null) {
           if(that.data.page === 1) {
             wx.showToast({
               title: '抱歉,无此经纪公司',
               icon: 'none',
               duration: 2000
             })
           } else {
             wx.showToast({
               title: '抱歉，已加载完毕',
               icon: 'none',
               duration: 2000
             })
           }
         } else {
           for (var i = 0; i < res.data.data.content.length; i++) {
             that.data.newCompantList.push(res.data.data.content[i]);
           }
           that.setData({
             listCompany: that.data.newCompantList
           })
         }
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(that.httpCompanyList());
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
  },
  // 选择保险公司
  clickItem: function (e) {
    var that = this;
    that.setData({
      infoCompany: e.target.dataset.text  ,
      companyId: e.target.dataset.id,
      catalogSelect: e.target.dataset.id
    })
    // 我的-更新，注册-不更新
    if (app.globalData.upDateCompany === true) {
      // 更新全局的保险公司名称
      // app.globalData.companyName = that.data.infoCompany;
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      // 设置上一个页面的保险公司id
      prevPage.setData({
        companyData: {
          id: that.data.companyId,
          name: that.data.infoCompany
        }
      })
      wx.navigateBack({
        delta: 1
      })
    } else if (app.globalData.upDateCompany === false) {
      app.globalData.companyName = that.data.infoCompany;
      app.globalData.companyId = that.data.companyId
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
