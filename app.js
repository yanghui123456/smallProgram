// app.js
const ald = require('./utils/ald-stat.js')
//app.js
App({
  onLaunch: function () {
    var that = this;
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    wx.getSystemInfo({
      success: function (res) {
        if (res.model === 'iPhone X') {
          // 说明是iphonex设备
          that.globalData.isIpx = true;
        }
      },
    });
    // 登录
    wx.login({
      // rechargeMoneygoChongzhi
      success: res => {////dfdfdfdfdfdfdfffffvvvvv
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
          var params = {
            code:res.code
          }
          wx.request({
            url: that.globalData.severIp +'/insurance/broker/api/v1.0.0/select/openid',
            method: 'POST',
            header: { 'content-type': 'application/x-www-form-urlencoded'},
            data: params,
            success:function(res){
              // 已经获取openid
              if (res.data.businessCode === '0000') {
                that.globalData.openId = res.data.data;
                // 校验openid是否 注册过，注册过直接跳转到tab页面
                wx.request({
                  url: that.globalData.severIp + '/insurance/broker/api/v1.0.0/check/openid',
                  method: 'POST',
                  header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.globalData.openId },
                  success: function (res) {
                // 0002=openid未注册或者审核拒绝  0004=openid被停用(目前不会返回),  0005=openid正在审核中, 0003=openid审核通过
                    if (res.data.businessCode === '0002') {
                      // 该openid未注册不做跳转到tabbar
                      that.globalData.registerOpenid = 'false';
                      console.log('经纪人未注册');
                      // 默认走空白页面加的 走开通页面无需加
                      wx.navigateTo({
                        url: '/pages/1-register/4-mutipleVersion/4-mutipleVersion',
                      })
                    } else if (res.data.businessCode === '0003') {
                      // openid已经注册过，跳转至tabbar
                      that.globalData.registerOpenid = 'true';
                      console.log('经纪人已注册');
                      that.globalData.agentInfo = res.data.data;
                      wx.switchTab({
                        url: "/pages/2-tabs/0-ipCard/0-ipCard",
                      });
                    } else if (res.data.businessCode === '0005') {
                      that.globalData.registerOpenid = 'wait';
                      console.log('正在审核。。。');
                      // 默认走空白页面加的 走开通页面无需加
                      wx.navigateTo({
                        url: '/pages/1-register/4-mutipleVersion/4-mutipleVersion',
                      })
                    }
                  }
                })
              } else {
                console.log('不知道什么状态');
                wx.showToast({
                  title: res.data.msg,
                  icon:'none',
                  duration:2000
                })
              }
            }
          })
      }
    }),
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo
              console.log('用户同意授权');
              console.log(that.globalData.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 获取session_key
  getSessionKey:function(a) {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        var params = {
          code: res.code
        }
        wx.request({
          url: that.globalData.severIp + '/insurance/broker/api/v1.0.0/select/openid',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: params,
          success: function (res) {
            // 已经获取openid
            that.globalData.openId = res.data.data;
            // 校验openid是否 注册过，注册过直接跳转到tab页面
            wx.request({
              url: that.globalData.severIp + '/insurance/broker/api/v1.0.0/check/openid',
              method: 'POST',
              header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.globalData.openId },
              success: function (res) {
                if (res.data.businessCode === '0002') {
                  // 该openid未注册不做跳转到tabbar
                  that.globalData.registerOpenid = 'false';
                  console.log('经纪人未注册');
                } else if (res.data.businessCode === '0003') {
                  // openid已经注册过，跳转至tabbar
                  that.globalData.registerOpenid = 'true';
                  that.globalData.agentInfo = res.data.data;
                  that.globalData.getSessionKey = true; //重新获取成功
                  a; // 获取完openid调的接口(参数)
                } else if (res.data.businessCode === '0005') {
                  that.globalData.registerOpenid = 'wait';
                }
              }
            })
          } 
        })
      }
    })
  },
  globalData: {
    // 测试地址
    // severIp: 'http://10.29.30.119:17037',
    // 卫超地址
    // severIp: 'http://10.29.75.191:17037',
    // 广才地址
    severIp: 'http://10.29.75.177:17037',
    // 域名
    // severIp:'https://broker.htaibao.com',
    // 是否是iphonex设备
    isIpx:false,
    // 用户信息
    userInfo: null,
     // 身份证校验通过的标识
    checkTrue: false,
    // 用户的openid
    openId: '',
    // openid 是否注册过
    registerOpenid: '',
    // 经纪人注册手机号
    phoneNum: '',
    // 发送模板消息使用的access_token
    access_token: '',
    // 经纪人注册过后经纪人的信息
    agentInfo: '',
    // 保险公司名称 
    companyName: '',
    companyId:'',
    // 上传保单成功后后台返回的地址
    uploadImgInfo:'',
    // 获取sessionKey的默认值，获取成功为true ,然后赋值到默认值
    getSessionKey:false,
    // 识别完成后用户点击完成按钮后台返回的信息
    confrimMsg: '',
    // 客户维护列表中点击某一个获取某一个的userid
    whUserId: '',
    // 上传保单成功到详情页，从详情页直接跳至客户详情页面
    uploadJoinDetail: '',
    // 经纪人已经包了红包 true=有红包 false=未包红包
    hasRedPaket:false, 
    paketNumber:'', //红包数量
    paketHtb:'',//海豚币个数
    hasPaycharge: '',//用户支付成功了
    editJoinConfrim: false,// 为true表示从用户列表编辑保单进入信息确认页 ,false标识上传保单进入
    editImgid: '',//编辑保单的id
    editImgurl:'',
    upDateCompany:false, //注册选择为false，我的选择为true
    pyqImgUrl:'', //朋友圈，已购买或者免费图片地址
    pyqText:'',//朋友圈，文本内容
    pyqType:'',//是否免费
    pyqTemplateId:'', //朋友圈推荐类型列表的模板id
    shareJjrId:'',
    teamData:'', //该用户有具体团队的时候返回的团队信息
    managerRoleData: '', //管理员角色查看经纪人下的客户维护列表==列表数据 team-derail页面
    managerRoleBrokerData: {
      bd:'',
      cd:'',
      id:'',
      img:'',
      kh:'',
      name:'',
      tel:''
    }, // 管理员角色查看经纪人下的经纪人信息==头部 team-derail页面
    beInvitTeamId:'' // 用户在接受邀请时的团队id 缓存起来，在注册个人版的时候调用 有值时注册个人版调接口，为空时不调用
    // beInvitTeamId:41
  },
  // 身份证号码校验
  checkCardNum: function (num) {
    var cardNum = num + '';
    // 对长度为15或者18的号码做处理
    if (cardNum.length === 15 || cardNum.length === 18) {
      // 判断身份证号前两位
      var cityCode = ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64', '65', '71', '81', '82', '91'];
      var cityNum = cardNum.substring(0, 2);
      if (cityCode.indexOf(cityNum) < 0) {
        wx.showToast({
          title: '您输入的身份证号码有误',
          icon: 'none',
          duration: 2000
        })
        return;
      } else {
        // 15位校验
        if (cardNum.length === 15) {
          // 前14位必须是数组
          this.contain_letter(cardNum, 14);
          // 获取出生日期，检验出生日期月和日
          var birtha = cardNum.substring(6, 14);
          var borthMoutha = birtha.substring(4, 6);
          var borthDaya = birtha.substring(6, 8);
          this.birth_date(Number(borthMoutha), Number(borthDaya));
           // 身份证校验通过的标识
          getApp().globalData.checkTrue = true;
        } else if (cardNum.length === 18) {
          // 前17位必须是数组
          this.contain_letter(cardNum, 17);
          // 获取出生日期，检验出生日期月和日
          var birth = cardNum.substring(6, 14);
          var borthMouth = birth.substring(4, 6);
          var borthDay = birth.substring(6, 8);
          this.birth_date(Number(borthMouth), Number(borthDay));
          var c = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          var b = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
          var idArray = cardNum.split('');
          var sum = 0;
          for (var k = 0; k < 17; k++) {
            sum += parseInt(idArray[k]) * parseInt(c[k]);
          }
          if (idArray[17].toUpperCase() !== b[sum % 11].toUpperCase()) {
            wx.showToast({
              title: '您输入的身份证号码有误',
              icon: 'none',
              duration: 2000
            })
            return;
          }
          // 身份证校验通过的标识
          getApp().globalData.checkTrue = true;
        }
      }
    } else {
      wx.showToast({
        title: '您输入的身份证号码有误',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 是否包含字母
  contain_letter(cardNum, num) {
    var letter = /[a-z]/i;
    var topSeventeen = cardNum.substring(0, num); // 前几位是否包含字母, num 为17则为前17位， num为16则为前16
    if (letter.test(topSeventeen)) {
      wx.showToast({
        title: '您输入的身份证号码有误',
        icon: 'none',
        duration: 2000
      })
      return;
    }
  },
  // 出生日期月和日校验
  birth_date(borthMouth, borthDay) {
    if (Number(borthMouth) === 1 || Number(borthMouth) === 3 || Number(borthMouth) === 5 || Number(borthMouth) === 7 || Number(borthMouth) === 8 || Number(borthMouth) === 10 || Number(borthMouth) === 12) {
      if (Number(borthDay) > 31) {
        wx.showToast({
          title: '您输入的身份证号码有误',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    } else if (Number(borthMouth) === 4 || Number(borthMouth) === 6 || Number(borthMouth) === 9 || Number(borthMouth) === 11) {
      if (Number(borthDay) > 30) {
        wx.showToast({
          title: '您输入的身份证号码有误',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    } else if (Number(borthMouth) === 2) {
      if (Number(borthDay) > 28) {
        wx.showToast({
          title: '您输入的身份证号码有误',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    } else {
      wx.showToast({
        title: '您输入的身份证号码有误',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 全局页面跳转navigateTo
  goNewPage: function (e) {
    wx.navigateTo({
      url: e.target.dataset.url,
    })
  }
})