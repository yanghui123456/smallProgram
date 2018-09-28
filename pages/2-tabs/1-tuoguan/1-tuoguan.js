//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    headUrl: '',
    realName: '',
    year:'',
    company:'',
    nickName:'',
    customerCount:'',
    textLength: '0',
    textContent:'',
    textList: ['真正的保险顾问，只为您提供专业的保险服务', '邀你享受免费保险管理服', '一键保险托管，免费测评风险','我是保险管家，我为自己代言'],
    showPlaceholder:true
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '百万保险顾问都在用的保单托管智能助理',
      path: '/pages/1-register/4-mutipleVersion/4-mutipleVersion',
      imageUrl: 'http://oss.baoxian.xujinkeji.com/broker/send-no-red.jpg',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  onLoad: function () {
    // 随机展示默认文本
    var nowSecond = new Date().getSeconds();
    if (nowSecond % 4 == 0) {
      this.setData({
        textContent: this.data.textList[0],
        showPlaceholder: false,
        textLength: this.data.textList[0].length
      })
    } else if (nowSecond % 4 == 1) {
      this.setData({
        textContent: this.data.textList[1],
        showPlaceholder: false,
        textLength: this.data.textList[1].length
      })
    } else if (nowSecond % 4 == 2) {
      this.setData({
        textContent: this.data.textList[2],
        showPlaceholder: false,
        textLength: this.data.textList[2].length
      })
    } else if (nowSecond % 4 == 3) {
      this.setData({
        textContent: this.data.textList[3],
        showPlaceholder: false,
        textLength: this.data.textList[3].length
      })
    } 
  },
  onShow: function () {
    this.setData({
      headUrl: app.globalData.agentInfo.headUrl,
      company: app.globalData.companyName,
    })
    if (this.data.textContent === '') {
      this.setData({
        showPlaceholder: true
      })
    } else {
      this.setData({
        showPlaceholder: false
      })
    }
    this.brokerInfo();
  },
  brokerInfo:function() {
    // 获取经纪人基本信息接口
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/broker/home/info',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            // headUrl: data.data.headUrl,
            realName: data.data.realName,
            year: data.data.term,
            tel: data.data.phoneNo,
            nickName: data.data.nickName,
            customerCount: data.data.customerCount,
            insuranceCount: data.data.insuranceCount,
            company: data.data.brokerCompanyName
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.brokerInfo());
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
  clickVoice:function() {
    wx.showToast({
      title: '功能正在研发中，请耐心等待...',
      icon: 'none',
      duration: 2000
    })
  },
  areaInput:function(e) {
    this.setData({
      textLength: e.detail.cursor, //文字的长度
      textContent: e.detail.value //文字的内容
    })
    if (e.detail.value === '') {
      this.setData({
        showPlaceholder: true
      })
    } else {
      this.setData({
        showPlaceholder: false
      })
    }
  },
  creatInvitation:function() {
    // 文字必填项
    if (this.data.textContent === '') {
      wx.showToast({
        title: '请输入要对用户说的话哦',
        icon:'none',
        duration:2000
      })
    } else {
      wx.navigateTo({
        url: '../../trusteeship/trusteeship-invitation/Invitation?content=' + this.data.textContent,
      })
    }
  }
})
