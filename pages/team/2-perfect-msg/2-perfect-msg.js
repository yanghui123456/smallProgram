const app = getApp()
Page({
  data: {
    isIpx: app.globalData.isIpx,
    showUploadImg: true,
    name: '',
    cardNum: '',
    companyName: '',
    companyId: '',
    jobName: '',
    year: '',
    imgSrc: '',
    formId: '' // 后台发送模板需要用到   申请认证按钮的formid
  },
  onLoad: function () {
  },
  onShow: function () {
    this.setData({
      companyName: app.globalData.companyName,
      companyId: app.globalData.companyId
    });
  },
  // 申请认证
  certification: function (e) {
    this.setData({
      formId: e.detail.formId
    });
    console.log(this.data.formId);
    // 姓名、身份证号、公司名称、职位为必填项
    if (this.data.name === '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.cardNum === '') {
      wx.showToast({
        title: '请输入身份证号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.cardNum !== '') {
      app.checkCardNum(this.data.cardNum);
      // 身份证校验通过的标识==存在app.js中
      if (app.globalData.checkTrue === true) {
        if (this.data.companyName === '') {
          wx.showToast({
            title: '请选择公司名称',
            icon: 'none',
            duration: 2000
          })
          return;
        } else if (this.data.jobName === '') {
          wx.showToast({
            title: '请输入职位',
            icon: 'none',
            duration: 2000
          })
          return;
        } else if (this.data.year === '') {
          wx.showToast({
            title: '请输入年限',
            icon: 'none',
            duration: 2000
          })
          return;
        } else if (this.data.year <= 0 || this.data.year > 40) {
          wx.showToast({
            title: '请输入正确的年限',
            icon: 'none',
            duration: 2000
          })
          return;
        } else {
          // 调接口
          var that = this;
          var rzParams = {
            phoneNo: app.globalData.phoneNum,   //手机号 
            idCard: that.data.cardNum,   //身份证号
            brokerCompanyId: that.data.companyId,   //保险公司id
            position: that.data.jobName,   //职位 
            realName: that.data.name,   //真实姓名
            term: that.data.year,   //年限
            avatarUrl: app.globalData.userInfo.avatarUrl, // 用户微信头像
            nickName: app.globalData.userInfo.nickName, // 用户微信昵称
            formId: that.data.formId//发送消息模板的formId
          };
          wx.showLoading({
            title: '正在提交',
            mask: true
          })
          wx.request({
            url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/broker/team/application/certification',
            method: 'POST',
            data: rzParams,
            header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
            success: function (res) {
              if (res.data.businessCode === '0000') {
                wx.hideLoading();
                app.globalData.agentInfo = res.data.data;
                console.log(res);
                wx.navigateTo({
                  url: '../../mine/buy-author/buy-author?back=0',
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
      }
    }
  },
  goSelectCompany: function () {
    app.globalData.upDateCompany = false;
    wx.navigateTo({
      url: '../../mine/insurance-company/insurance-company',
    })
  },
  // 姓名、身份证、职位、年限值获取
  nameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  idCardInput: function (e) {
    this.setData({
      cardNum: e.detail.value
    })
  },
  jobInput: function (e) {
    this.setData({
      jobName: e.detail.value
    })
  },
  yearInput: function (e) {
    this.setData({
      year: e.detail.value
    })
  },
  // 动画
  animations: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
      delay: 0
    })
    that.animation = animation
    animation.opacity(1).step()
    that.setData({
      animationData: animation.export()
    }),
      setTimeout(function () {
        animation.opacity(0).step()
        that.setData({
          animationData: animation.export()
        })
      }, 1500)
  },
  tipsWarn: function () {
    this.animations();
  },
  chooseImg: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '正在上传...',
          mask: true
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imgSrc: tempFilePaths,
          showUploadImg: false
        })
        wx.uploadFile({
          url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/broker/upload/qualification/certificate',
          filePath: tempFilePaths[0],
          header: { 'openid': app.globalData.openId },
          name: 'uploadFile',
          formData: {},
          success: function (res) {
            wx.hideLoading();
            var data = JSON.parse(res.data);
            console.log(data);
            if (data.businessCode === '0000') {
              that.setData({
                phoneNo: app.globalData.phoneNum,   //手机号 
                idCard: that.data.cardNum,   //身份证号
                brokerCompanyId: that.data.companyId,   //保险公司id
                position: that.data.jobName,   //职位 
                realName: that.data.name,   //真实姓名
                term: that.data.year,   //年限
                avatarUrl: app.globalData.userInfo.avatarUrl, // 用户微信头像
                nickName: app.globalData.userInfo.nickName, // 用户微信昵称
                formId: that.data.formId //发送消息模板的formId
              })
            } else {
              wx.showToast({
                title: data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
  }
})
