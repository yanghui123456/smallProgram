//index.js
//获取应用实例
const app = getApp()

Page({
  onShareAppMessage: function (res) {
    var topRes = res;
    var that = this;
    // 告知后台经纪人已经成功转发给用户了
    if (topRes.from === 'button') {
      // 来自页面内转发按钮
      console.log(topRes.target)
    }
    // 判断经纪人是否添加红包，未添加=托管邀请页面。已添加=发送红包
    if (that.data.hasMoney === true) {
      // 带着托管信息 头像、微信名字、保险公司。从业年限。客户托管人数、保险托管分数 、电话、经纪人id
        return {
          title: app.globalData.agentInfo.realName + '向您发送了一个专属保险托管服务申请。',
          path: '/pages/be-invited/no-red-paket/no-red-paket?brokerId=' + app.globalData.agentInfo.id + '&severIp=' + app.globalData.severIp + '&openId=' + app.globalData.openId + '&giftId=' + that.data.giftId,
          imageUrl: 'http://oss.baoxian.xujinkeji.com/broker/send-no-red.jpg',
          success: function (e) {
            // 转发成功
            wx.showToast({
              title: '转发成功',
              icon: 'success',
              duration: 2000
            })
            that.hideModel();
          },
          fail: function (e) {
            // 转发失败
            wx.showToast({
              title: '转发失败',
              icon: 'none',
              duration: 2000
            })
            that.shareErr();
          }
        }
    } else if (this.data.hasMoney === false) {
      return {
        title: app.globalData.agentInfo.realName + '向您发送了一个红包邀请，点击立即领取',
        path: '/pages/be-invited/2-has-red-paket/has-red-paket?brokerId=' + app.globalData.agentInfo.id + '&severIp=' + app.globalData.severIp + '&openId=' + app.globalData.openId + '&giftId=' + that.data.giftId,
        imageUrl: 'http://oss.baoxian.xujinkeji.com/broker/send-has-red.jpg',
        success: function (res) {
          // 转发成功
          wx.showToast({
            title: '转发成功',
            icon: 'success',
            duration: 2000
          })
          that.hideModel();
          that.setData({
            hasMoney:true,
            noMoney:false,
            redPaketNumber: '',
            htNumber: ''
          })
        },
        fail: function (res) {
          // 转发失败
          wx.showToast({
            title: '转发失败',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            hasMoney: true,
            noMoney: false,
            redPaketNumber: '',
            htNumber: ''
          })
          that.shareErr();
        }
      }
    }
  },
  data: {
    bgImg: "http://oss.baoxian.xujinkeji.com/broker/newBackGround.png",  //背景图
    dataImg: "http://oss.baoxian.xujinkeji.com/broker/send-has-red.jpg",   //内容缩略图
    ewrImg: "http://oss.baoxian.xujinkeji.com/broker/qrcode.jpg",  //小程序二维码图片
    systemInfo: null,  //系统类型
    canvasWidth: 0,   //canvas的宽
    canvasHeight: 0,   //canvas的高
    // 显示添加红包，还是已经填加了红包
    showModel:false,
    hasMoney: true,
    noMoney: false,
    redPaketNumber: '',
    htNumber: '',
    openPaket: false,
    headImg: '',
    wxName: '',
    company: '',
    year: '',
    insuranceCount:'',
    customerCount:'',
    userTalk:'',
    giftId:'',//礼物id
    nowTime:''
  },
  downloadImages: function () {
    wx.showLoading({
      title: '正在生成中。。。',
    })
    let that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          systemInfo:res
        })
        wx.downloadFile({  //背景图
          url: that.data.bgImg,
          success: function (res) {
            wx.downloadFile({  //内容缩略图
              url: that.data.dataImg,
              success: function (res1) {
                wx.downloadFile({
                  url: that.data.ewrImg,
                  success: function (res2) {//  小程序二维码图
                    that.convas(res.tempFilePath, res1.tempFilePath, res2.tempFilePath);
                  },
                  fail: function () {
                  }
                });
              }
            });
          }
        })
      },
    })

  },
  convas: function (bgImg, dataImg, ewrImg) {
    let that = this;
    var ctx = wx.createCanvasContext('myCanvas');
    var scWidth = that.data.systemInfo.windowWidth;
    var scHeight = that.data.systemInfo.screenHeight;
    var defaultHeight = 0.020 * that.data.systemInfo.screenHeight;
    //第一步：刻画背景图
    ctx.drawImage(bgImg, 0, 0, scWidth, scHeight);
    //第二步：刻画背景色
    ctx.setFillStyle('white');
    ctx.fillRect(20, 30, scWidth - 40, scHeight - 60);
    //第三步：刻画内容缩略图
    // var imgHeight = parseInt(that.imageProportion());
    var imgHeight = 50;
    ctx.drawImage(dataImg, 20, 30, scWidth - 40, imgHeight);
    //第三步：刻画标题
    ctx.setFillStyle('#333333');
    ctx.setFontSize(16)
    ctx.setTextAlign('center');
    ctx.fillText("海豚保管", (scWidth) / 2, imgHeight + 63 + defaultHeight);
    //第四步：刻画内容;(备注：canvas好像没有自动换行，有需要此步骤的同学，可根据canvas宽度，设置文字个数)
    ctx.setFillStyle('#333333');
    ctx.setTextAlign('left');
    ctx.setFontSize(14)
    ctx.fillText("最好用的保单管理工具", 35, imgHeight + 100 + defaultHeight);
    ctx.fillText("你值得拥有", 35, imgHeight + 125 + defaultHeight);
    // ctx.fillText("、色斑。皮肤松弛等现象逐渐出现，这时", 35, imgHeight + 150 + defaultHeight);
    // ctx.fillText("，抗衰老工程也正式展开。", 35, imgHeight + 175 + defaultHeight);
    //  第五步：刻画小程序码
    ctx.drawImage(ewrImg, 35, imgHeight + 150 + defaultHeight, 70,50);
    //第六步：提示用户，长按图片下载或分享
    ctx.setFillStyle('#333333')
    ctx.setFontSize(13)
    ctx.fillText('长按码查看详情', 165, imgHeight + 150 + defaultHeight);
    ctx.fillText('小程序名字', 165, imgHeight + 180 + defaultHeight);
    //第七步将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中

    ctx.draw(false, function (e) {
      //第八步：生成图片并预览
      that.imageGeneratePreview();
    });
  },
  imageGeneratePreview: function () {
    let that = this;
    //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径
    wx.canvasToTempFilePath({
      width: this.data.systemInfo.windowWidth,
      height: this.data.systemInfo.screenHeight,
      destWidth: this.data.systemInfo.windowWidth * 3,
      destHeight: this.data.systemInfo.screenHeight * 3,
      canvasId: 'myCanvas',
      success: function (res) {
        //预览图片
        wx.previewImage({
          urls: res.tempFilePath.split(','),   // 需要预览的图片http链接列表
          fail: function (res) {
            console.log("预览图片失败" + res)
          }
        })
      },
      fail: function (res) {
        console.log("出错了:" + JSON.stringify(res));
      }, complete: function () {
        wx.hideLoading();
      }
    })
  },
  //事件处理函数
  onLoad: function (res) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      userTalk: res.content
    })
    // http://oss.baoxian.xujinkeji.com/broker/newBackGround.png
    app.globalData.hasRedPaket = false;
    
    // 区分是邀请者还是被邀请者
    // res中包含页面路径后带的参数  this.page可以获取到页面的路由
    // if (JSON.stringify(res) == "{}") {
    //   this.setData({
    //     hasMoney: true,
    //     // hasMoney: false,
    //     noMoney: false
    //   })
    // } else {
    //   this.setData({
    //     hasMoney: false,
    //     noMoney: true,
    //     redPaketNumber: res.num2,
    //     htNumber: res.num1
    //   })
    // }
    // 获取详情
    this.getDetail();
  },
  shareErr: function () {
    var that = this;
    var params = {
      brokerGiftId: that.data.giftId
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/oneRedEnvelope/sendCancel',
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.hideModel();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.shareErr());
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
  onShow:function(res) {
    // 判断app.js  globalData是否有红包
      if (app.globalData.hasRedPaket === true) {
        //有红包
        this.setData({
          hasMoney:false,
          noMoney:true,
          redPaketNumber: app.globalData.paketNumber,
          htNumber: app.globalData.paketHtb
        })
        app.globalData.hasRedPaket = false;
      } else if (app.globalData.hasRedPaket === false) {
        //无红包
        this.setData({
          hasMoney: true,
          noMoney: false,
          htNumber: '',
          redPaketNumber:''
        })
      }
  },
  getNogiftId:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/broker/trusteeship/invitation',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id,//经纪人id
        content: that.data.userTalk,//用户说的话
        count: '',//海豚币数量
        dolphinCoin: '',//海豚币总额
        type: 4 // 无礼物
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            giftId: data.data
          })
          that.hideModel();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getNogiftId);
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
  aaa:function() {
    wx.navigateTo({
      url: '../../be-invited/no-red-paket/no-red-paket?brokerId=' + app.globalData.agentInfo.id + '&severIp=' + app.globalData.severIp + '&openId=' + app.globalData.openId + '&giftId=' + this.data.giftId,
    })
  },
  getHasgiftId:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/broker/trusteeship/invitation',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id,//经纪人id
        content: that.data.userTalk,//用户说的话
        count: that.data.redPaketNumber,//红包个数
        dolphinCoin: that.data.htNumber,//海豚币
        type: 1 // 海豚币
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          console.log(data);
          that.setData({
            giftId: data.data
          })
          that.hideModel();
          // wx.navigateTo({
          //   url: '../../be-invited/2-has-red-paket/has-red-paket?brokerId=' + app.globalData.agentInfo.id + '&severIp=' + app.globalData.severIp + '&openId=' + app.globalData.openId + '&giftId=' + that.data.giftId,
          // })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getHasgiftId);
        }else {
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
  getDetail:function() {
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
            headImg: data.data.headUrl,
            wxName: data.data.nickName,
            company: data.data.brokerCompanyName,
            realName: data.data.realName,
            tel: data.data.phoneNo,
            year: data.data.term,
            insuranceCount: data.data.insuranceCount,
            customerCount: data.data.customerCount
          })
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
        wx.hideLoading();
      }
    })
  },
  shareYh:function() {
    if (this.data.redPaketNumber == '') {
      this.getNogiftId();
    } else if (this.data.redPaketNumber !== '') {
      this.getHasgiftId();
    }
  },
  cancelShare:function() {
    this.shareErr();
  },
  hideModel:function() {
    this.setData({
      showModel: !this.data.showModel
    })
  },
  sharePyq:function() {
    wx.showToast({
      title: '暂未开启',
      icon: 'none',
      duration: 2000
    })
    // this.downloadImages();
    //模拟转发客户有红包流程
    // var that = this; 
    // wx.request({
    //   url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/broker/trusteeship/invitation',
    //   method: 'POST',
    //   data: {
    //     brokerId: app.globalData.agentInfo.id,//经纪人id
    //     content: that.data.userTalk,//用户说的话
    //     count: that.data.redPaketNumber,//红包个数
    //     dolphinCoin: that.data.htNumber,//海豚币
    //     type: 1 // 海豚币
    //   },
    //   header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
    //   success: function (res) {
    //     var data = res.data;
    //     if (data.businessCode === '0000') {
    //       console.log(data);
    //       that.setData({
    //         giftId: data.data
    //       })
    //       wx.navigateTo({
    //         url: '../../be-invited/2-has-red-paket/has-red-paket?brokerId=' + app.globalData.agentInfo.id + '&severIp=' + app.globalData.severIp + '&openId=' + app.globalData.openId + '&giftId=' + that.data.giftId,
    //       })
    //     } else {
    //       wx.showToast({
    //         title: data.msg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //       return;
    //     }
    //   }
    // })
  },
  goRedPaket:function() {
    wx.navigateTo({
      url: '../trusteeship-redpaket/redPaket',
    })
    //用添加红包模拟转发客户无红包流程
    // var that = this; 
    // wx.request({
    //   url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/broker/trusteeship/invitation',
    //   method: 'POST',
    //   data: {
    //     brokerId: app.globalData.agentInfo.id,//经纪人id
    //     content: that.data.userTalk,//用户说的话
    //     count: '',//海豚币数量
    //     dolphinCoin: '',//海豚币总额
    //     type: 4 // 无礼物
    //   },
    //   header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
    //   success: function (res) {
    //     var data = res.data;
    //     if (data.businessCode === '0000') {
    //       console.log(data);
    //       that.setData({
    //         giftId: data.data
    //       })
    //       wx.navigateTo({
    //         url: '../../be-invited/no-red-paket/no-red-paket?brokerId=' + app.globalData.agentInfo.id + '&severIp=' + app.globalData.severIp + '&openId=' + app.globalData.openId + '&giftId=' + that.data.giftId,
    //       })
    //     } else {
    //       wx.showToast({
    //         title: data.msg,
    //         icon: 'none',
    //         duration: 2000
    //       })
    //       return;
    //     }
    //   }
    // })
  },
  callPhone:function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel,
    })
  }
})
