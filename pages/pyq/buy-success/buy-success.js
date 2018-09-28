//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showShareStep:false,
    showSaveToast:false,
    imgUrl:'',
    imgText:'',
    imgType:''
  },
  //事件处理函数
  onLoad: function () {
    this.setData({
      imgUrl: app.globalData.pyqImgUrl,
      imgText: app.globalData.pyqText,
      imgType:app.globalData.pyqType
    })
  },
  onShow: function () {
  },
  back:function() {
    wx.navigateBack({
      delta: 1
    })
  },
  saveSuccess:function() {
    this.setData({
      showSaveToast: !this.data.showSaveToast
    })
  },
  authorization:function() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('用户同意保存');
              // 保存图片
              that.saveImg();
            },
            fail() {
              console.log('用户拒绝保存');
            }
          })
        } else {
          console.log('用户同意过了直接保存');
          that.saveImg();
        }
      }
    })
  },
  // 保存次数
  httpSaveCount: function () {
    var that = this;
    var params = {
      templateId: app.globalData.pyqTemplateId
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/download/friendcircle/picture',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data: params,
      success: function (res) {
        if (res.data.businessCode === '0000') {
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(thats.httpSaveCount());
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  saveImg:function() {
    var that = this;
    wx.showLoading({
      title: '图片正在保存中',
    })
    // 复制文本内容
    wx.setClipboardData({
      data: that.data.imgText,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res);
          }
        })
      }
    })
    console.log(app.globalData.pyqImgUrl);
    wx.downloadFile({
      url: that.data.imgUrl,
      success:function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.hideLoading();
            wx.showToast({
              title: '图片保存成功',
              icon:'success',
              duration:2000
            })
            that.saveSuccess();
            that.httpSaveCount();
          },
          fail(res){
            wx.showToast({
              title: '图片保存失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail:function(res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: '下载失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  coloseshareStep:function() {
    this.setData({
      showShareStep: !this.data.showShareStep
    })
  },
  shareStep:function() {
    this.coloseshareStep();
  }
})
