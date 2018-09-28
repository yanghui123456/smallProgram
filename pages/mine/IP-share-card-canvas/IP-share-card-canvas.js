// pages/mine/IP-card/IP-card.js
//获取应用实例
const app = getApp();
Page({
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '你好,我是' + that.data.brokerName + ',这是我的名片',
      path: '/pages/mine/IP-share-card-canvas/IP-share-card-canvas?brokerId=' + that.data.brokerId + '&serverIP=' + that.data.serverIP + '&brokerCardId=' + that.data.brokerCarid,
      imageUrl:that.data.shareUrl,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
        that.getShareCount();
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
  data: {
    animationData: {},
    isHide: false,
    noColorZan: true,
    colorZan: false,
    serverIP: '',
    brokerId: '',
    brokerCarid: '',// 经纪人名片id
    showAuthor: true,
    newUserInfo: '', // 查看名片用户的信息
    useropenId: '', // 查看名片用户的openid
    userName: '',//查看名片的用户昵称
    company: '',
    brokerName: '',
    year: '',
    headUrl: '',
    tuoguanCount: '',
    insuranceCount: '',
    praisedCount: '',
    browseCount: '',
    browseImgList: '',
    brokerTel: '',
    wxNo: '',
    mail: '',
    address: '',
    introduction: '',
    brokerPhotoWall: '',
    praiseStatus: '',
    showFormid: true,
    formId: '',
    screenWidth:'',
    temporaryImgUrl: '', // 临时图片地址
    shareUrl: '',// 分享时的图片地址
    canvasBack: '', // 画布中背景的临时路径
    canvasBrokerUrl: '', // 画布中经纪人头像的临时路径
    clickSee:false
  },
  onLoad: function (res) {
    this.setData({
      serverIP: res.serverIP,
      brokerId: res.brokerId,
      brokerCarid: res.brokerCardId
    })
    this.getOpenid();
    this.getSystermInfo();
  },
  // 获取设备宽度
  getSystermInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          screenWidth: res.screenWidth
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '获取设备信息失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  buildImg: function () {
    var that = this;
    // 将用户的头像和背景下载到本地，获取文件的本地临时路径
    wx.downloadFile({
      url: 'http://oss.baoxian.xujinkeji.com/broker/ipCardBack.png',
      success(res) {
        if (res.statusCode === 200) {
          that.setData({
            canvasBack: res.tempFilePath
          })
          wx.downloadFile({
            url: that.data.headUrl, //经纪人全局头像网络地址
            success(res) {
              if (res.statusCode === 200) {
                that.setData({
                  canvasBrokerUrl: res.tempFilePath
                })
                //先创建一个画布
                const ctx = wx.createCanvasContext("ipCanvasid")
                //填充背景色
                ctx.fillStyle = '#eee';
                ctx.fillRect(0, 0, that.data.screenWidth, 260)
                //将图片转化为画布
                ctx.drawImage(that.data.canvasBack, 0, 0, that.data.screenWidth, 260)
                ctx.drawImage(that.data.canvasBrokerUrl, (that.data.screenWidth / 2) - 40, 30, 80, 80) // headUrl
                ctx.setFontSize(17)
                ctx.setFillStyle("#fff")
                ctx.setTextAlign('center')
                ctx.fillText(that.data.brokerName, (that.data.screenWidth / 2), 140, that.data.screenWidth);
                ctx.setFontSize(11)
                ctx.setFillStyle("#fff")
                ctx.setTextAlign('center')
                ctx.fillText(that.data.company + that.data.year + '年经验', (that.data.screenWidth / 2), 160, that.data.screenWidth);
                ctx.setFontSize(16)
                ctx.setFillStyle("#fff")
                ctx.setTextAlign('center')
                ctx.fillText(that.data.tuoguanCount + '个', (that.data.screenWidth / 2) / 2, 200, that.data.screenWidth / 2);
                ctx.setFontSize(16)
                ctx.setFillStyle("#fff")
                ctx.setTextAlign('center')
                ctx.fillText(that.data.insuranceCount + '个', (that.data.screenWidth / 2) + (that.data.screenWidth / 2) / 2, 200, that.data.screenWidth / 2);
                ctx.setFontSize(11)
                ctx.setFillStyle("#fff")
                ctx.setTextAlign('center')
                ctx.fillText('托管客户', (that.data.screenWidth / 2) / 2, 220, that.data.screenWidth / 2);
                ctx.setFontSize(11) // 设置文本的字体大小
                ctx.setFillStyle("#fff") // 设置文本的颜色
                ctx.setTextAlign('center') // 设置文本对齐方式
                ctx.fillText('托管保单', (that.data.screenWidth / 2) + (that.data.screenWidth / 2) / 2, 220, that.data.screenWidth / 2);
                //成功执行，draw方法中进行回调
                ctx.draw(true, function () {
                  console.log("draw callback success")
                  //保存临时图片
                  wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 500,
                    height: 400,
                    destWidth: 500,
                    destHeight: 400,
                    canvasId: 'ipCanvasid',
                    success: function (res) {
                      console.log("get tempfilepath(success) is:", res.tempFilePath)
                      that.setData({
                        temporaryImgUrl: res.tempFilePath
                      })
                      that.uploadCanvasImg(); // 上传生成的画布图片，转发时需要使用
                    },
                    fail: function () {
                      console.log('get tempfilepath is fail')
                    }
                  })
                })
              }
            }
          })
        }
      }
    })

  },
  uploadCanvasImg: function () {
    var that = this;
    wx.uploadFile({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/uploadPicture/' + app.globalData.agentInfo.id,
      filePath: that.data.temporaryImgUrl,
      header: { 'openid': app.globalData.openId },
      name: 'file',
      formData: {},
      success: function (res) {
        if (JSON.parse(res.data).businessCode === '0000') {
          that.setData({
            shareUrl: JSON.parse(res.data).data
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      }
    })
  },
  // 名片分享次数接口
  getShareCount: function () {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/share',
      method: 'POST',
      data: {
        brokerId: that.data.brokerId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {

        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getCardId());
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
  // 获取用户的openid
  getOpenid: function () {
    var that = this;
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var params = {
          code: res.code
        }
        wx.request({
          url: that.data.serverIP + '/insurance/broker/api/v1.0.0/select/openid',
          method: 'POST',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          data: params,
          success: function (res) {
            // 已经获取被邀请用户的openid
            that.data.useropenId = res.data.data;
            that.getAuthor();
            that.ipInfo(); // 获取经纪人信息
          }
        })
      }
    })
  },
  // 获取formId
  getFormId: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      formId: e.detail.formId
    });
    this.init();
  },
  // 获取用户授权
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
                newUserInfo: res.userInfo
              })
            }
          })
          that.setData({
            showAuthor: false,
            showFormid: true
          })
          // 用户已授权：白色消失，黑色出现，点击确认按钮后，初始化
        } else {
          wx.hideLoading();
          console.log('未授权')
          that.setData({
            showAuthor: true,
            showFormid: true
          })
          // 用户未授权：白色出现，黑色出现，点击确认按钮后，初始化
        }
      }
    })
  },
  // 弹出授权弹窗
  getUserInfo: function (e) {
    console.log(e)
    var that = this;
    if (e.detail.errMsg === 'getUserInfo:ok') {
      // 授权失败，授权成功
      console.log('用户允许');
      wx.getUserInfo({
        lang: 'zh_CN',
        success: function (res) {
          console.log(res);
          that.setData({
            newUserInfo: res.userInfo
          })
          that.setData({
            showAuthor: false,
            showFormid: true
          })
        },
        fail: function (res) {
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      console.log('用户拒绝');
      wx.showToast({
        title: '授权后才可查看详细信息哦',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        showAuthor: true,
        showFormid: true
      })
    }
  },
  // 初始化
  init: function () {
    var that = this;
    wx.request({
      url: that.data.serverIP + '/insurance/broker/api/v2.0.0/brokerVisitor/add',
      method: 'POST',
      data: {
        brokerCardId: that.data.brokerCarid,
        headUrl: that.data.newUserInfo.avatarUrl,
        nickName: that.data.newUserInfo.nickName,
        sex: that.data.newUserInfo.gender,
        city: that.data.newUserInfo.city,
        formId: that.data.formId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            showFormid: false,
            clickSee:true
          })
          that.ipInfo(); // 获取经纪人信息
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.init());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      }
    })
  },
  // 获取经纪人信息
  ipInfo: function () {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.request({
      url: that.data.serverIP + '/insurance/broker/api/v2.0.0/brokerCard/query',
      method: 'POST',
      data: {
        brokerId: that.data.brokerId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            company: data.data.brokerPersonalInfoModel.companyName,
            brokerName: data.data.brokerPersonalInfoModel.realName,
            year: data.data.brokerPersonalInfoModel.term,
            headUrl: data.data.brokerPersonalInfoModel.headUrl,
            tuoguanCount: data.data.brokerPersonalInfoModel.customerCount,
            insuranceCount: data.data.brokerPersonalInfoModel.billCount,
            praisedCount: data.data.praisedCount,
            browseCount: data.data.browseCount,
            browseImgList: data.data.userHeadUrls,
            brokerTel: data.data.brokerPersonalInfoModel.phoneNo,
            wxNo: data.data.brokerCard.wxNo,
            mail: data.data.brokerCard.mail,
            address: data.data.brokerCard.address,
            introduction: data.data.brokerCard.introduction,
            brokerPhotoWall: data.data.brokerCardPhotoWallModels,
            praiseStatus: data.data.brokerVisitorPraisedStatus
          })
          that.buildImg();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.ipInfo());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading();
      }
    })
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel
    })
  },
  copy: function (e) {
    // 复制文本内容
    wx.setClipboardData({
      data: e.target.dataset.msg,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res);
          }
        })
      }
    })
  },
  zan: function () {
    // 灰色的消失，黑色的出来，然后黑色的消失，灰色的再出来
    this.setData({
      noColorZan: false,
      colorZan: true
    })
    this.animations();
  },
  animations: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.width(12).height(12).width(25).height(25).rotate(20).step();
    animation.rotate(12).rotate(0).step();
    this.setData({
      animationData: animation.export()
    })

    setTimeout(function () {
      animation.width(2).height(2).step()
      that.setData({
        animationData: animation.export(),
        colorZan: false,
        noColorZan: true
      })
      that.praise();
    }, 400)
  },
  // 点赞接口
  praise: function () {
    var that = this;
    wx.request({
      url: that.data.serverIP + '/insurance/broker/api/v2.0.0/brokerVisitor/praise',
      method: 'POST',
      data: {
        brokerCardId: that.data.brokerCarid
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': that.data.useropenId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          wx.showToast({
            title: '点赞成功',
            icon: 'success',
            duration: 2000
          })
          that.ipInfo();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.praise());
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
  switchDetail: function (e) {
    if (e.target.dataset.show == 'hide') {
      this.setData({
        isHide: true
      })
    } else if (e.target.dataset.show == 'show') {
      this.setData({
        isHide: false
      })
    }
  },
  goSettinng: function () {
    wx.navigateTo({
      url: '../setting/setting',
    })
  },
  // 添加到手机通讯录
  addContact: function (e) {
    var tel = e.target.dataset.tel;
    wx.addPhoneContact({
      mobilePhoneNumber: tel,//经纪人手机号
      success: function () {
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000
        })
      },
      fail: function () {
        wx.showToast({
          title: '添加失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})