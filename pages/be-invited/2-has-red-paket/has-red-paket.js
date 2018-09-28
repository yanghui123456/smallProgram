//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    invitationUser: false,
    showTimer: true,
    timer: null,
    count: '',
    hasMoney: '', // 用来区分跳转的页面，有红包值为1=跳转至领取成功页面，无红包值为2=跳转至无红包成功页面
    // 上个页面url中带的
    useropenId:'',//用户的openid
    openId: '',//经纪人的openid
    brokerId:'',//经纪人id
    severIp: '',//调取的后台接口
    giftId:'',//礼物id
    nickName: '',
    realName: '',
    headImg: '',
    tel: '',
    company:'',
    year: '',
    customerCount:'',
    insuranceCount: '',
    beInvitUserHeadList: '',
    userTalk: '',
    receliveMoney: '',
    totalMoney: '',
    receiveNum: '',
    totalNum: '',
    noGetRedPaket: true,
    hasGetRedPaket: false,
    noMoney:false,
    hasOvertime:false,
    hasRelation:false,
    hasGetHtb: '',
    telNum:'',
    teltelCodeNum: '',
    passWord:'',
    userHeadImg: '',//被邀请用户的头像==授权后的信息
    userNickName: '',//被邀请用户的昵称
    userSex: '',//被邀请用户的性别
    userRegion: '',//被邀请用户的地
    hasRegister:false,
    showAuthor: true,
    showFormid: true,
    formId: ''
  },
  //事件处理函数
  onLoad: function (res) {
    this.setData({
      brokerId: res.brokerId,//经纪人id
      severIp: res.severIp,//调取的后台接口
      giftId: res.giftId//礼物id
    })
    this.getOpenid();
    this.getAuthor(); // 判断是否授权
  },
  getAuthor: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          console.log('已授权')
          wx.getUserInfo({
            lang: 'zh_CN',
            success: function (res) {
              console.log(res.userInfo)
              that.setData({
                showAuthor:false,
                userHeadImg: res.userInfo.avatarUrl,//被邀请用户的头像==授权后的信息
                userNickName: res.userInfo.nickName,//被邀请用户的昵称
                userSex: res.userInfo.gender,//被邀请用户的性别
                userRegion: res.userInfo.province//被邀请用户的地区
              })
            }
          })
        } else {
          console.log('未授权')
          that.setData({
            showAuthor: true,
            showFormid: true
          })
        }
      }
    })
  },
  // 获取formid
  getFormId: function (e) {
    // 把formId 传给后台
    var that = this;
    that.setData({
      formId: e.detail.formId,
    })    
    wx.request({
      url: that.data.severIp + '/insurance/broker/api/v2.0.0/brokerVisitor/trusteeship',
      method: 'POST',
      data: {
        brokerGiftId: that.data.giftId,//礼物id
        formId: that.data.formId,
        headUrl: that.data.userHeadImg,
        nickName: that.data.userNickName,
        sex: that.data.userSex,
        city: that.data.userRegion
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
         that.setData({
           showFormid: false
         })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getFormId());
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
  //获取被邀请用户的openid
  getOpenid: function () {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        var params = {
          code: res.code
        }
        wx.request({
          url: that.data.severIp + '/insurance/broker/api/v1.0.0/select/openid',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: params,
          success: function (res) {
            // 已经获取被邀请用户的openid
            that.data.useropenId = res.data.data;
            that.getDetail();
            that.getInvitPeple();
          }
        })
      }
    })
  },
  //获取经纪人邀请过的人数和头像列表、说过的话
  getInvitPeple: function () {
    var that = this;
    wx.request({
      url: that.data.severIp + '/insurance/broker/api/v1.0.0/user/receive/invitation/view',
      method: 'POST',
      data: {
        brokerGiftId: that.data.giftId//礼物id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            beInvitUserHeadList: data.data.userHeadUrls,
            userTalk: data.data.content,
            receliveMoney: data.data.receliveMoney,
            totalMoney: data.data.totalMoney,
            receiveNum: data.data.receiveNum,
            totalNum: data.data.totalNum
          })
          if (data.data.alreadyReceive === '') {
            // 用户未领取
            that.setData({
              noMoney: false,
              noGetRedPaket: true,
              hasRelation:false,
              hasGetRedPaket: false,
              hasOvertime: false,
            })
          } else {
            // 用户已领取
            that.setData({
              noMoney: false,
              noGetRedPaket: false,
              hasGetRedPaket: true,
              hasOvertime: false,
              hasRelation:false,
              hasGetHtb: data.data.alreadyReceive
            })
          }
        } else if (data.businessCode === '0013') {
          // 紅包过期
          that.setData({
            noMoney: false,
            noGetRedPaket: false,
            hasGetRedPaket: false,
            hasOvertime: true,
            hasRelation:false,
            beInvitUserHeadList: data.data.userHeadUrls,
            userTalk: data.data.content,
            receliveMoney: data.data.receliveMoney,
            totalMoney: data.data.totalMoney,
            receiveNum: data.data.receiveNum,
            totalNum: data.data.totalNum
          })
        } else if (data.businessCode === '0012') {
          // 红包领取完毕
          that.setData({
            noMoney: true,
            noGetRedPaket: false,
            hasGetRedPaket: false,
            hasOvertime:false,
            hasRelation:false,
            beInvitUserHeadList: data.data.userHeadUrls,
            userTalk: data.data.content,
            receliveMoney: data.data.receliveMoney,
            totalMoney: data.data.totalMoney,
            receiveNum: data.data.receiveNum,
            totalNum: data.data.totalNum
          })
        } else if (data.businessCode === '0005') {
          // 用户与经纪人存在托管关系
          that.setData({
            noMoney: false,
            noGetRedPaket: false,
            hasGetRedPaket: false,
            hasOvertime: false,
            hasRelation: true,
            beInvitUserHeadList: data.data.userHeadUrls,
            userTalk: data.data.content,
            receliveMoney: data.data.receliveMoney,
            totalMoney: data.data.totalMoney,
            receiveNum: data.data.receiveNum,
            totalNum: data.data.totalNum
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getInvitPeple());
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
  // 获取经纪人信息 ===通过经纪人分享页面url带过来的经纪人id
  getDetail: function () {
    var that = this;
    wx.request({
      url: that.data.severIp + '/insurance/broker/api/v1.0.0/broker/home/info',
      method: 'POST',
      data: {
        brokerId: that.data.brokerId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            headImg: data.data.headUrl,
            nickName: data.data.nickName,
            realName: data.data.realName,
            company: data.data.brokerCompanyName,
            tel: data.data.phoneNo,
            year: data.data.term,
            insuranceCount: data.data.insuranceCount,
            customerCount: data.data.customerCount
          })
          // 根据后台返回判断该用户是否已经被托管，进而展示不同的页面
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getDetail());
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
  get_verification_code: function () {
    var reg = new RegExp(/^1\d{10}$/);
    if (this.data.telNum === '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.telNum.length !== 11) {
      wx.showToast({
        title: '请输入11位手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (!reg.test(this.data.telNum)) {
      wx.showToast({
        title: '手机号码格式有误',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      this.getYqm();
    }
  },
  // 获取验证码
  getYqm: function () {
    var that = this;
    wx.request({
      url: that.data.severIp + '/insurance/broker/api/v1.0.0/receive/invitation/code',
      method: 'POST',
      data: {
        phoneNo: that.data.telNum,//手机号码
        brokerGiftId: that.data.giftId//礼物id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            showTimer: false
          })
          that.timer_count_down();
          // 根据后台返回判断该用户是否已经被托管，进而展示不同的页面
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getYqm());
        } else if (data.businessCode === '0002') {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
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
  timer_count_down() {
    var that = this;
    var TIME_COUNT = 60;
    if (!that.data.timer) {
      that.setData({
        count: TIME_COUNT
      })
      that.data.timer = setInterval(function () {
        if (that.data.count > 0 && that.data.count <= TIME_COUNT) {
          that.data.count--;
          that.setData({
            count: that.data.count--
          })
        } else {
          clearInterval(that.data.timer);
          that.setData({
            timer: null,
            showTimer: true
          })
        }
      }, 1000);
    }
  },
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel,
    })
  },
  // 用户先进行授权
  onGotUserInfo: function (e) {
    console.log(e); // 用户信息
    // 通过e.currentTarget.dataset中的id区分用户领取的红包是否还有
    if (e.detail.errMsg === 'getUserInfo:ok') {
      //  授权成功
      this.setData({
        invitationUser: true,
        showAuthor: false,
        hasMoney: e.currentTarget.dataset.type,
        userHeadImg: e.detail.userInfo.avatarUrl,//被邀请用户的头像==授权后的信息
        userNickName: e.detail.userInfo.nickName,//被邀请用户的昵称
        userSex: e.detail.userInfo.gender,//被邀请用户的性别
        userRegion: e.detail.userInfo.province,//被邀请用户的地区
      })
    } else {
      // 授权失败
      wx.showToast({
        title: '授权后才可继续进行哦',
        icon: 'none',
        duration: 2000
      })
    }
  },
  hideMask: function () {
    clearInterval(this.data.timer);
    this.setData({
      invitationUser: false,
      showTimer: true,
      timer: null,
      count: ''
    })
  },
  agreeInvitation: function () {
    var reg = new RegExp(/^1\d{10}$/);
    if (this.data.telNum === '') {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.telNum.length !== 11) {
      wx.showToast({
        title: '请输入11位手机号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (!reg.test(this.data.telNum)) {
      wx.showToast({
        title: '手机号码格式有误',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.teltelCodeNum === '' || this.data.teltelCodeNum.length !== 6) {
      wx.showToast({
        title: '验证码格式有误',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      // 同意接受邀请
      this.agreeInvit();
    }
  },
  // 用户接受经纪人的邀请
  agreeInvit: function () {
    var that = this;
    wx.request({
      url: that.data.severIp + '/insurance/broker/api/v1.0.0/redpackage/receive/invitation',
      method: 'POST',
      data: {
        brokerGiftId: that.data.giftId,//礼物id
        phoneNo: that.data.telNum,//手机号
        smsCode: that.data.teltelCodeNum,//验证码
        userHeadUrl: that.data.userHeadImg,// 用户头像
        nickName: that.data.userNickName,//昵称
        sex: that.data.userSex,//性别: 1男  2女  0未知  	
        city: that.data.userRegion// 地区
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          //0000=注册过 0001=未注册过
            that.setData({
              invitationUser: false
            })
            wx.redirectTo({
              url: '../2-invitation-success/2-invitation-success?brokerId=' + that.data.brokerId + '&ip=' + that.data.severIp + '&openid=' + that.data.useropenId + '&money=' + data.data
            })
        } else if (data.businessCode === '0001') {
          that.setData({
            hasRegister: true,
            invitationUser:false
          })
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
  telNumInput: function (e) {
    this.setData({
      telNum: e.detail.value
    })
  },
  telCodeInput: function (e) {
    this.setData({
      teltelCodeNum: e.detail.value
    })
  },
  passWordInput: function (e) {
    this.setData({
      passWord: e.detail.value
    })
  },
  register: function () {
    // 判断密码格式是否正确
    if (this.data.passWord === '') {
      wx: wx.showToast({
        title: '密码不可为空',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.passWord.length < 6) {
      wx: wx.showToast({
        title: '密码长度需大于6位',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (/[a-z]/i.test(this.data.passWord) === false) {
      wx: wx.showToast({
        title: '密码需要包含字母',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      // 注册接口
      this.registerHttp();
    }
  },
  registerHttp: function () {
    var that = this;
    wx.request({
      url: that.data.severIp + '/insurance/broker/api/v1.0.0/password/receive/invitation',
      method: 'POST',
      data: {
        brokerGiftId: that.data.giftId,//礼物id
        phoneNo: that.data.telNum,//手机号
        smsCode: that.data.teltelCodeNum,//验证码
        userHeadUrl: that.data.userHeadImg,// 用户头像
        nickName: that.data.userNickName,//昵称
        sex: that.data.userSex,//性别: 1男  2女  0未知  	
        city: that.data.userRegion,// 地区
        password: that.data.passWord//密码
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        console.log(data);
        if (data.businessCode === '0000') {
          wx.showToast({
            title: '您已成功接受邀请',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            hasRegister: false
          })
         // 调领取红包接口后进入领取成功页面 获取领取红包金额
            // 带着经纪人的brokerId过去，请求的Ip ，openid下个页面要展示经纪人的信息
          wx.redirectTo({
            url: '../2-invitation-success/2-invitation-success?brokerId=' + that.data.brokerId + '&ip=' + that.data.severIp + '&openid=' + that.data.useropenId + '&money=' + data.data
          })
        } else if (data.businessCode === '0012') {
          wx.showToast({
            title: '您来晚了，红包领取完毕',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            noMoney: true,
            noGetRedPaket: false,
            hasGetRedPaket: false,
            hasOvertime:false,
            hasRelation:false
          })
        } else if (data.businessCode === '0013') {
          wx.showToast({
            title: data.msg,
            icon: 'success',
            duration: 2000
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.registerHttp());
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
