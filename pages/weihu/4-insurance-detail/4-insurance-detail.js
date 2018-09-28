//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasData: false,
    showDutyList: false,
    showMore: false,
    showInfo: false,
    showInsuranceImg: false,
    whitchOne: '', // 查看的是被保人还是投保人的信息
    // 所有保障责任列表
    dutyList:[],
    dutyList4: '',
    commonInfo: '',
    // 投保人信息
    policyInfo: {},
    // 被保人信息
    insuredInfo: {},
    detailInsuranceName: '',
    detailInsuranceNum: '',
    detailInsuredName: '',
    beneficiaryName: '',
    tbr:'',
    bbr:'',
    maxLimit: '',
    companyLogoWhiteX2: '',
    paymentTime: '',
    allTerm: '',
    paidTerm: '',
    paid: '',
    unpaid: '',
    companyTelephone: '',
    billId:'',
    billImageUrl:''
  },
  // 页面加载
  onLoad: function (res) {
     // 获取上页地址栏带的billId、userId
    this.setData({
      billId:res.billId
    })
    this.detail();
  },
  detail:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/bill/' + that.data.billId,
      method: 'get',
      header: { 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        console.log(data);
        if (data.businessCode === '0000') {
          // 赋值
          that.setData({
            companyLogoWhiteX2: data.data.companyLogoWhiteX2,
            detailInsuranceName: data.data.billName,
            maxLimit: data.data.maxLimit,
            detailInsuranceNum: data.data.billNo,
            detailInsuredName: data.data.insured.applicantName,
            dutyList: data.data.billLimit,
            tbr: data.data.policyHolder.policyHolderName,
            bbr: data.data.insured.applicantName,
            beneficiaryName: data.data.beneficiaryName,
            paymentTime: data.data.paymentTime,
            allTerm: data.data.allTerm,
            paidTerm: data.data.paidTerm,
            paid: data.data.paid,
            unpaid: data.data.unpaid,
            companyTelephone: data.data.companyTelephone,
            insuredInfo: data.data.insured,
            policyInfo: data.data.policyHolder,
            billImageUrl: data.data.billImageUrl
          })
          console.log(that.data.insuredInfo);
          console.log(that.data.policyInfo);
          // 保障责任列表数组
          if (that.data.dutyList.length > 5) {
            that.setData({
              dutyList4: that.data.dutyList.slice(0, 5),
              showMore: true
            })
          } else {
            that.setData({
              dutyList4: that.data.dutyList,
              showMore: false
            })
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.detail());
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
  call:function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel //仅为示例，并非真实的电话号码
    })
  },
  closeList:function() {
    this.setData({
      showDutyList: false
    })
  },
  showList:function() {
    this.setData({
      showDutyList: true
    })
  },
  // 查看投保人、被保人详细信息
  seeDetail:function(e) {
    if (e.target.dataset.type === '投保人') {
      this.setData({
        commonInfo: this.data.policyInfo,
        showInfo: true,
        whitchOne: '投'
      })
    } else if (e.target.dataset.type === '被保人') {
      this.setData({
        commonInfo: this.data.insuredInfo,
        showInfo: true,
        whitchOne: '被'
      })
    }
  },
  closeDetail:function() {
    this.setData({
      showInfo: false
    })
  },
  showInsuranceImg:function() {
    this.setData({
      showInsuranceImg: !this.data.showInsuranceImg
    })
  }
})
