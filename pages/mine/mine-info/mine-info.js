//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    companyData:'',
    infoImg:'',
    infoName: '',
    infoCompany:'',
    infoYear: '',
    infoTel: '',
    infoCardNum:'',
    page: 1,
    newCompantList: [],
    wxNo:'',
    mail:'',
    address:'',
    introduce:'',
    fileId:'', // 头像id
    brokerCompanyId:'', // 保险公司id
    showAdressArea:false, // 地址文本域
    showAdressVal:false, // 地址有值
    showAdressNo:false, // 地址无值
    showIntArea:false, // 自我介绍文本域
    showIntVal:false, // 自我介绍有值
    showIntNo:false // 自我介绍无值
  },
  //事件处理函数
  onLoad: function () {
    this.detailInfo();
  },
  onShow: function () {
    // 更新保险公司名称
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    // 判断是不是从选择保险公司页面返回的，不是的话保险公司名称从经纪人信息中去，是的话从companyData中取
    if (currPage.data.companyData === '') {
      this.setData({
        infoCompany: app.globalData.companyName
      })
    } else {
      this.setData({
        infoCompany: currPage.data.companyData.name,
        brokerCompanyId: currPage.data.companyData.id
      })
    }
  },
  modifyHeadImg:function() {
    // app.goNewPage(e);
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
                infoImg: JSON.parse(res.data).data.headUrl,
                fileId: JSON.parse(res.data).data.fileId
              })
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
  },
  goSelectCompany:function() {
    app.globalData.upDateCompany = true;
    wx.navigateTo({
      url: '../insurance-company/insurance-company',
    })
  },
  // 基本信息
  detailInfo:function() {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerInfo/query/detail/' + app.globalData.agentInfo.id,
      method: 'GET',
      header: { 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            introduce: data.data.introduction,
            infoTel: data.data.phoneNo,
            infoCardNum: data.data.idCard,
            infoYear: data.data.term,
            infoName: data.data.realName,
            infoImg: data.data.headUrl
          })
          // 微信，邮箱，地址，自我介绍 null判断
          if (data.data.wxNo == null) {
            that.setData({
              wxNo: '',
            })
          } else {
            that.setData({
              wxNo: data.data.wxNo,
            })
          }
          if (data.data.mail == null) {
            that.setData({
              mail: '',
            })
          } else {
            that.setData({
              mail: data.data.mail,
            })
          }
          if (data.data.address == null) {
            that.setData({
              address: '',
              showAdressNo: true, // 地址无值
            })
          } else {
            that.setData({
              address: data.data.address,
              showAdressVal: true, // 地址有值
            })
          }
          if (data.data.introduction == null) {
            that.setData({
              introduce: '',
              showIntNo: true // 自我介绍无值
            })
          } else {
            that.setData({
              introduce: data.data.introduction,
              showIntVal: true, // 自我介绍有值
            })
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.detailInfo());
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
  // 保存
  upDate:function() {
    console.log('头像id' + this.data.fileId)
    console.log('保险公司id' + this.data.brokerCompanyId)
    console.log('微信号' + this.data.wxNo)
    console.log('邮箱' + this.data.mail)
    console.log('地址' + this.data.address)
    console.log('自我介绍' + this.data.introduce);
    var that = this;
    var params = {
      brokerId: app.globalData.agentInfo.id,
      fileId: this.data.fileId,
      brokerCompanyId: this.data.brokerCompanyId,
      wxNo: this.data.wxNo,
      mail: this.data.mail,
      address: this.data.address,
      introduction: this.data.introduce
    }
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v2.0.0/brokerCard/save',
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        if (res.data.businessCode === '0000') {
          app.globalData.agentInfo.headUrl = that.data.infoImg; //更新全局经纪人头像地址
          app.globalData.companyName = that.data.infoCompany;//更新全局经纪人保险公司地址
          wx.showToast({
            title: '保存成功',
            icon:"success",
            duration:2000
          })
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(that.upDate());
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
  wxInput: function (e) {
    this.setData({
      wxNo: e.detail.value
    })
  },
  mailInput:function(e) {
    this.setData({
      mail: e.detail.value
    })
  },
  addressInput:function(e) {
    if(this.data.address.length == 50) {
      wx.showToast({
        title: '最多可输入50字',
        icon:'none',
        duration:2000
      })
    }
    this.setData({
      address: e.detail.value
    })
  },
  addressBlur:function() {
    if (this.data.address == '') {
      this.setData({
        showAdressArea: false,
        showAdressVal: false,
        showAdressNo: true
      })
    } else {
      this.setData({
        showAdressArea: false,
        showAdressVal: true,
        showAdressNo: false
      })
    }
  },
  click:function() {
    this.setData({
      showAdressArea: true,
      showAdressVal: false,
      showAdressNo:false
    })
  },
  introduceInput:function(e) {
    if (this.data.introduce.length == 200) {
      wx.showToast({
        title: '最多可输入200字',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      introduce: e.detail.value
    })
  },
  introduceBlur:function() {
    if (this.data.introduce == '') {
      this.setData({
        showIntArea: false,
        showIntVal: false,
        showIntNo: true
      })
    } else {
      this.setData({
        showIntArea: false,
        showIntVal: true,
        showIntNo: false
      })
    }
  },
  clicka: function () {
    this.setData({
      showIntArea: true,
      showIntVal: false,
      showIntNo: false
    })
  },
})
