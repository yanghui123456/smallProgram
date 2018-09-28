//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    headImg: ''
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    that.setData({
      headImg: app.globalData.agentInfo.headUrl
    })
  },
  uploadHeadImg:function() {
    // 更新头像
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/brokerInfo/headImage/update/' + app.globalData.agentInfo.id,
          filePath: tempFilePaths[0],
          header: { 'openid': app.globalData.openId },
          name: 'file',
          formData: {},
          success: function (res) {
            if (JSON.parse(res.data).businessCode === '0000') {
              that.setData({
                headImg: JSON.parse(res.data).data.headUrl
              })
              // app.globalData.agentInfo.headUrl = JSON.parse(res.data).data.headUrl;
              app.globalData.upLoadimgFileId = JSON.parse(res.data).data.fileId; // 上传图片返回的id放到全局中
              app.globalData.upLoadimgUrl = JSON.parse(res.data).data.headUrl; // 上传图片返回的地址放到全局中
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
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
});
