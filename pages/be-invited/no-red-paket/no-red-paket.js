//index.js
//获取应用实例
const app = getApp()
// 用户进入小程序的界面都需要传入用户的openid
Page({
  onShareAppMessage: function (res) {
    var that = this;
      // 用户转发给用户需要，第二个用户使用的跟第一个用户相同的礼物id
      return {
        title: '海立信向您发送了一个专属保险托管服务申请。',
        path: '/pages/be-invited/no-red-paket/no-red-paket?brokerId=' + that.data.brokerId + '&severIp=' + that.data.severIp + '&giftId=' + that.data.giftId,
        imageUrl: './images/redPaket.png',
        success: function (e) {
          // 转发成功
          console.log("转发成功:" + JSON.stringify(e));
          wx.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 2000
          })
        },
        fail: function (e) {
          // 转发失败
          console.log("转发失败:" + JSON.stringify(e));
          wx.showToast({
            title: '转发失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
  },
  data: {
    hasTuoguan: false,
    noTuoguan:true,
    hasOvertime:false,
    alreadyReceive:'',
    beInvitUserHeadList:[],//被邀请用户头像列表
    teltelCodeNum:'',
    passWord:'',
    telNum:'',
    invitationUser: false,
    hasRegister:false,
    showTimer:true,
    timer: null,
    count: '',
    wxName:'',
    headImg: '',//经纪人信息
    realName: '',
    company:'',
    year: '',
    tel:'',
    customerCount:'',
    insuranceCount: '',
    brokerId: '', // 经纪人id
    openId: '', //经纪人的openId
    useropenId: '',//被邀请用户的openId
    severIp: '', //服务器地址
    giftId: '', //礼物Id
    userHeadImg: '',//被邀请用户的头像==授权后的信息
    userNickName: '',//被邀请用户的昵称
    userSex: '',//被邀请用户的性别
    userRegion: '',//被邀请用户的地区
    showAuthor:true,
    showFormid:true,
    formId:''
  },
  //事件处理函数
  onLoad: function (res) {
    this.setData({
      brokerId: res.brokerId,
      openId: res.openId,//经纪人的openid
      severIp: res.severIp, //服务器地址
      giftId: res.giftId //礼物Id
    })
    this.getOpenid();
    this.getAuthor(); // 判断是否授权
    console.log(res);
  },
  getAuthor:function() {
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
  getFormId:function(e) {
    this.setData({
      formId: e.detail.formId
    })
    this.sendFormId();
  },
  sendFormId:function() {
    var that = this;
    // 把formId 传给后台
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
  sharePyq:function() {
    wx.showToast({
      title: '暂未开启此功能',
      icon:'none',
      duration:2000
    })
  },
  //获取被邀请用户的openid
  getOpenid:function() {
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
  // 获取经纪人信息 ===通过经纪人分享页面url带过来的经纪人id
  getDetail: function() {
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
              wxName: data.data.nickName,
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
          }  else {
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
  //获取经纪人邀请过的人数和头像列表、说过的话
  getInvitPeple:function() {
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
            userTalk: data.data.content
          })
          if (data.data.alreadyReceive === '') {
            // 用户未接受过邀请
            that.setData({
              hasTuoguan: false,
              noTuoguan:true,
              hasOvertime:false
            })
          } else {
            // 用户已接受过邀请
            that.setData({
              alreadyReceive: data.data.alreadyReceive,
              hasTuoguan: true,
              noTuoguan:false,
              hasOvertime:false
            })
          }
        } else if (data.businessCode === '0013') {
          // 邀请过期
          that.setData({
            hasTuoguan: false,
            noTuoguan: false,
            hasOvertime: true
          })
        }else if (data.businessCode === '0009') {
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
  //获取验证码
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
  getYqm:function() {
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
  onGotUserInfo:function(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      //  授权成功
      this.setData({
        showAuthor:false,
        invitationUser: true,
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
  hideMask:function() {
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
    } else if (this.data.teltelCodeNum === '') {
      wx.showToast({
        title: '验证码不可为空',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.teltelCodeNum.length !== 6) {
      wx.showToast({
        title: '验证码格式错误',
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
  agreeInvit:function() {
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
          // 手机号码已经在app端注册过==直接同意托管
          wx.redirectTo({
            url: '../invitation-success/invitation-success?brokerId=' + that.data.brokerId + '&ip=' + that.data.severIp + '&openid=' + that.data.useropenId,
          })
        } else if (data.businessCode === '0011') {
          // 没有在app端注册过
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
  passWordInput:function(e) {
    this.setData({
      passWord: e.detail.value
    })
  },
  register:function() {
    // 判断密码格式是否正确
    if (this.data.passWord === '') {
      wx:wx.showToast({
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
  registerHttp:function() {
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
        if (data.businessCode === '0000') {
          wx.showToast({
            title: '您已成功接受邀请',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            hasRegister: false
          })
          // 带着经纪人的brokerId过去，请求的Ip ，openid下个页面要展示经纪人的信息
          wx.redirectTo({
            url: '../invitation-success/invitation-success?brokerId=' + that.data.brokerId + '&ip=' + that.data.severIp + '&openid=' + that.data.useropenId,
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
