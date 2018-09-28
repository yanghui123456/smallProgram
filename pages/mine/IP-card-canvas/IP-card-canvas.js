// pages/mine/IP-card/IP-card.js
//获取应用实例
const app = getApp();
Page({
  onPullDownRefresh: function () {
    this.onShow();
  },
  onShareAppMessage: function (res) {
    var that = this;
    wx.pageScrollTo({
      scrollTop: 0
    })
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '你好,我是' + that.data.brokerName + ',这是我的名片',
      path: '/pages/mine/IP-share-card-canvas/IP-share-card-canvas?brokerId=' + app.globalData.agentInfo.id + '&serverIP=' + app.globalData.severIp + '&brokerCardId=' + that.data.brokerCarId,
      imageUrl: that.data.shareUrl,
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
    // 信息绑定
    brokerName: '',
    company: '',
    headUrl: '',
    year: '',
    tuoguanCount: '',
    insuranceCount: '',
    praisedCount: '',
    browseCount: '',
    browseImgList: '',
    brokerTel: '',
    wxNo: '',
    brokerCard: '',
    address: '',
    introduction: '',
    brokerPhotoWall: '',
    brokerCarId: '',
    praiseStatus: '', // 0=未点赞 ，1=已点赞
    screenWidth: '',
    temporaryImgUrl: '', // 临时图片地址
    shareUrl: '',// 分享时的图片地址
    canvasBack: '', // 画布中背景的临时路径
    canvasBrokerUrl: '' // 画布中经纪人头像的临时路径
  },
  onLoad: function (options) {
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
    })
    this.getSystermInfo();
    this.getCardId();
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
            url: app.globalData.agentInfo.headUrl, //经纪人全局头像网络地址
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
                ctx.drawImage(that.data.canvasBrokerUrl, (that.data.screenWidth / 2) - 40, 30, 80, 80)
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
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {

        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getShareCount());
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
  // 获取名片id
  getCardId: function () {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/init',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 判断是不是null
          if (data.data === null) {
            wx.showToast({
              title: '名片id为null',
            })
          } else {
            that.setData({
              brokerCarId: data.data,
            })
            that.ipInfo(); // 获取经纪人ip名片信息
          }
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
  // ip详细信息
  ipInfo: function () {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/query',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
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
            praiseStatus: data.data.brokerCard.praiseStatus
          })
          that.buildImg(); // 获取经纪人信息后在生成图片否则无经纪人信息
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.ipInfo());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        wx.stopPullDownRefresh();
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
  // 点赞接口
  praise: function () {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerVisitor/praise',
      method: 'POST',
      data: {
        brokerCardId: that.data.brokerCarId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
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
      url: '../mine-info/mine-info',
    })
  },
  shareIP: function () {
    wx.navigateTo({
      url: '../IP-share-card-canvas/IP-share-card-canvas?brokerId=' + app.globalData.agentInfo.id + '&serverIP=' + app.globalData.severIp + '&brokerCardId=' + this.data.brokerCarId,
    })
  },
  uploadImg: function () {
    // 更新头像 最大限制5张
    var that = this;
    if (that.data.brokerPhotoWall.length == 5) {
      wx.showToast({
        title: '最多可上传5张',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          wx.showLoading({
            title: '正在上传',
          })
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/photo/add/' + app.globalData.agentInfo.id,
            filePath: tempFilePaths[0],
            header: { 'openid': app.globalData.openId },
            name: 'file',
            formData: {},
            success: function (res) {
              wx.hideLoading();
              if (JSON.parse(res.data).businessCode === '0000') {
                wx.showToast({
                  title: '上传成功',
                  icon: 'success',
                  duration: 2000
                })
                that.ipInfo();
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      })
    }
  },
  deletPhoto: function (e) {
    wx.showLoading({
      title: '正在删除',
    })
    var that = this;
    var imgId = e.target.dataset.id;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/photo/delete',
      method: 'POST',
      data: {
        brokerCardId: that.data.brokerCarId,
        photoId: imgId,
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          that.ipInfo();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.deletPhoto());
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
  }
  // shareIP: function () {
  //   wx.navigateTo({
  //     url: '../IP-share-card/IP-share-card?brokerId=' + app.globalData.agentInfo.id + '&serverIP=' + app.globalData.severIp + '&brokerCardId=' + this.data.brokerCarId,
  //   })
  // }
})