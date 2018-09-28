//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cardParams: '', //通过被保人身份证号码去获取信息的参数
    holdercardParams: '', //通过投保人身份证号码去获取信息的参数
    tbrId:'',
    bbrId:'',
    currentDate: '', // 当天日期
    // 被保人证件类型===开始
    insuredCardArr: ['身份证', '居住证', '签证', '护照', '户口本', '军人证', '团员证', '党员证', '港澳通行证', '其他'],
    insuredCardIndex: 0,
    insuredCardIdArr: [1,2,3,4,5,6,7,8,9,0], // 该值与上方文字值对应
    insuredCardId: 1,  // 被保人证件类型id
    insuredCardText: '身份证', // 被保人证件类型文字
    // 被保人证件类型===结束

    // 被保人性别===开始
    insuredSexArr: ['男', '女'], // 被保人性别
    insuredSexIndex: '', // 默认显示被保人性别数组第一项
    // 被保人性别===结束
    
    samePersonArr: ['是', '否'], // 是否为同一人
    sameIndex: '',
    // 投保人证件类型===开始
    holderCardArr: ['身份证', '居住证', '签证', '护照', '户口本', '军人证', '团员证', '党员证', '港澳通行证', '其他'],
    holderCardIndex:0,
    holderCardId: 1,  // 被保人证件类型id
    holderCardText: '身份证', // 被保人证件类型文字
    // 投保人证件类型===结束
    holderSexArr: ['男', '女'], // 投保人性别
    holderSexIndex:0,
    holderSexId: '',

    payWayArr:['月缴', '年缴', '一次性缴清'], // 缴费方式
    payWayIndex: 0,

    waitArr: [],  // 等待期
    periodDate: '', // 自定义保险期间

    showRelationList:false,
    showInsuredPeriod:false,
    showCompany:false,
    samePersonShow: false, // 为同一人时展示的灰色背景禁用样式
    showAddItem:false,
    checkCard: '', //  被保人false身份证校验失败， true身份证校验成功
    checkCard1: '', //  投保人false身份证校验失败， true身份证校验成功
    relationDefault: 0,
    companyDefault:'',
    clickRelationId: '', // 点击家庭角色是的家庭角色id 和 文字
    clickRelationText:'',
    companyList: [],
    // 页面绑值后显示
    hasRelation: true, // 家庭角色
    showPayEnd:true, // 是否展示缴费终止选择项  缴费方式为一次性支付时隐藏
    hasinsuredcadrVal: 0, // 0为无值 1为有值  被保人证件号码是否有值
    hasinsurednameVal: 0, // 0为无值 1为有值  被保人姓名
    hasholdercadrVal: 0, // 0为无值 1为有值  投保人证件号码是否有值
    hasholderdnameVal: 0, // 0为无值 1为有值  投保人姓名
    hasbenefitnameVal: 0,  // 0为无值 1为有值  受益人姓名
    hasbddmcVal: 0,// 0为无值 1为有值  保单名称
    hasbdhVal: 0,// 0为无值 1为有值  保单号
    hasmqbfVal: 0, // 0为无值 1为有值  每期保费
    // 页面绑值
    relationID: '', // 最终已经确认过的家庭角色id 和 文字
    relationText: '',// 家庭角色
    insuredCardNum: '', // 被保人证件号码
    insuredName: '', // 被保人姓名
    insuredSexId: '', // 被保人性别id  0=女  1=男
    insuredDate: '', // 被保人出生日期
    isSamePerson: '', // 是否为同一人 0=否 1=是
    holderCardNum: '', // 投保人证件号码
    holderName: '', // 投保人姓名
    holderSex: '', // 投保人性别
    holderDate: '',// 投保人出生日期
    beneficiaryName: '', // 受益人姓名
    insuredCompany: '', //保险公司
    insuredCompanyId: '', // 保险公司id
    clickCompantId:'', // 未确认的保险公司id
    clickCompanyText:'', // 未确认的保险公司名称
    insuranceName: '', //保单名称
    policyNum: '', // 保单号
    validDate: '', // 生效日
    insureEndTime:'', // 失效日 传给后台的
    insuredPerodVal:'', //保险期间
    payWayId: '', // 缴费方式  id  1=月缴 2=年缴 3=一次性缴清
    periodMoney: '', //每期保费
    payStartDate: '',  // 缴费开始日期
    payEndDate: '',  // 缴费终止日期
    waitIndex: '', // 等待期天数
    guaranteeDuty:'', // 保障责任请输入
    duty:'', // 新增条责任
    money: '', // 新增条金额
    addDutyList:[], // 临时新增赋值的保障责任列表
    delDutyList: [],// 临时删除赋值的保障责任列表
    dutyList: [], // 最终的保障责任列表
    editImgid:'',
    editImgurl:'',
    showOriginalImg: false,
    billUploadType:''
  },
  // 页面加载
  onLoad: function (res) {
    this.waitAndNowtime();
    this.companyLogoList();
    // 后台返回的信息进行绑值
    if (app.globalData.editJoinConfrim === false) {
      this.setData({
        // 被保人信息绑定 ===证件类型后台固定返回身份证
        insuredName: app.globalData.confrimMsg.baseInfo.applicantInfo.applicantName, //被保人姓名
        hasinsurednameVal: app.globalData.confrimMsg.baseInfo.applicantInfo.applicantName === '' ? 0 : 1,//被保人姓名是否为空样式
        insuredCardNum: app.globalData.confrimMsg.baseInfo.applicantInfo.applicantID,//被保人证件号码
        hasinsuredcadrVal: app.globalData.confrimMsg.baseInfo.applicantInfo.applicantID === '' ? 0 : 1,//被保人证件号码是否为空样式
        insuredDate: app.globalData.confrimMsg.baseInfo.applicantInfo.applicantBirthday,//被保人出生日期
        // 投保人信息绑定
        holderCardNum: app.globalData.confrimMsg.baseInfo.insurantInfo.insurantID,//投保人证件号码
        hasholdercadrVal: app.globalData.confrimMsg.baseInfo.insurantInfo.insurantID === '' ? 0 : 1,//投保人证件是否为空样式

        holderName: app.globalData.confrimMsg.baseInfo.insurantInfo.insurantName,//投保人姓名
        hasholderdnameVal: app.globalData.confrimMsg.baseInfo.insurantInfo.insurantName === '' ? 0 : 1,//投保人姓名是否为空样式
        holderDate: app.globalData.confrimMsg.baseInfo.insurantInfo.insurantBirthday,//投保人出生日期

        policyNum: app.globalData.confrimMsg.baseInfo.InsuranceNumber, // 保单号
        hasbdhVal: app.globalData.confrimMsg.baseInfo.InsuranceNumber === '' ? 0 : 1, //保单是否为空样式
        insuranceName: app.globalData.confrimMsg.baseInfo.insuranceName,//保单名称
        hasbddmcVal: app.globalData.confrimMsg.baseInfo.insuranceName === '' ? 0 : 1,//保单名称是否为空样式
        insuredCompany: app.globalData.confrimMsg.baseInfo.companyName,// 保险公司名字
        validDate: app.globalData.confrimMsg.baseInfo.startTime,//生效日
        insuredPerodVal: app.globalData.confrimMsg.baseInfo.endTime === '' ? '保至终身' : app.globalData.confrimMsg.baseInfo.endTime,//失效日
        periodMoney: app.globalData.confrimMsg.baseInfo.insureMoney,//每期保费
        hasmqbfVal: app.globalData.confrimMsg.baseInfo.insureMoney === '' ? 0 : 1,//每期保费为空样式
        payStartDate: app.globalData.confrimMsg.baseInfo.payStartTime,//缴费开始日期
        dutyList: app.globalData.confrimMsg.dutyInfo, // 保障责任列表
        editImgurl: app.globalData.editImgurl,
        billUploadType:0
      })
      // 被保人性别赋值
      if (app.globalData.confrimMsg.baseInfo.applicantInfo.applicantSex === '') {
        this.setData({
          insuredSexIndex: '',
          insuredSexId: ''
        })
      } else if (app.globalData.confrimMsg.baseInfo.applicantInfo.applicantSex === '女') {
        this.setData({
          insuredSexIndex: 1,
          insuredSexId: 0
        })
      } else if (app.globalData.confrimMsg.baseInfo.applicantInfo.applicantSex === '男') {
        this.setData({
          insuredSexIndex: 0,
          insuredSexId: 1
        })
      }
      // 投保人性别赋值
      if (app.globalData.confrimMsg.baseInfo.insurantInfo.insurantSex === '') {
        this.setData({
          holderSexIndex: '',
          holderSexId: ''
        })
      } else if (app.globalData.confrimMsg.baseInfo.insurantInfo.insurantSex === '女') {
        this.setData({
          holderSexIndex: 1,
          holderSexId: 0
        })
      } else if (app.globalData.confrimMsg.baseInfo.insurantInfo.insurantSex === '男') {
        this.setData({
          holderSexIndex: 0,
          holderSexId: 1
        })
      }
      // 通过被保人和投保人的身份证号码去获取信息
      this.getInsuredInfo();
      this.getHolderInfo();
    } else if (app.globalData.editJoinConfrim === true) {
      // 保单id、地址
      this.setData({
        editImgid: app.globalData.editImgid,
        editImgurl: app.globalData.editImgurl,
        billUploadType: 1
      })
    }
  },
  seeOriginalImg:function() {
    this.setData({
      showOriginalImg: !this.data.showOriginalImg
    })
  },
  onShow:function() {
    if (app.globalData.uploadJoinDetail === true){
      wx.redirectTo({
        url: '../1-detail/1-detail',
      })
    }
  },
  waitAndNowtime:function() {
    // 等待期数组赋值==180天、获取当前日期
    var watiNewArr = [];
    for (var i = 0; i <= 180; i++) {
      watiNewArr.push(i);
    }
    var nowDate = new Date();
    var nowYear = nowDate.getFullYear();
    var nowMouth = nowDate.getMonth() < 10 ? '0' + (nowDate.getMonth() + 1) : (nowDate.getMonth() + 1);
    var nowDay = nowDate.getDate() < 10 ? '0' + nowDate.getDate() : nowDate.getDate();
    var nowTime = nowYear + '-' + nowMouth + '-' + nowDay;
    this.setData({
      waitArr: watiNewArr,
      currentDate: nowTime
    })
  },
  // 保险公司列表
  companyLogoList:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/bill/company/query',
      method: 'GET',
      header: { 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            companyList:data.data
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.companyLogoList());
        } else {
          wx.showToast({
            title: data.msg,
            icon:'none',
            duration:2000
          })
        }
      }
    })
  },
  // 保障责任输入事件
  guarantInput:function(e){
    this.setData({
      guaranteeDuty: e.detail.value
    })
  },
  // 保障责任失去焦点
  guarantBlur:function(e) {
    if (this.data.guaranteeDuty !== '') {
      this.setData({
        duty: this.data.guaranteeDuty,
        showAddItem: true,
        guaranteeDuty: ''
      })
    }
  },
  // 新增保障金额输入事件
  addguarantInput:function(e) {
    this.setData({
      money: e.detail.value
    })
  },
  // 新增保障金额失去焦点
  addguarantBlur:function(e){
    if (this.data.money !== '') {
      //  dutyList 往列表中追加一项
      var item = {
        dutyId: this.data.dutyList.length + 1,
        dutyName: this.data.duty,
        dutySum: this.data.money
      }
      this.data.addDutyList.push(item);
      this.setData({
        dutyList: this.data.addDutyList,
        showAddItem: false,
        money:''
      })
    }
  },
  // 删除某一项保障责任
  deletedDuty:function(e) {
    this.setData({
      delDutyList: []
    })
    for (var i = 0; i < this.data.dutyList.length; i++) {
      if (this.data.dutyList[i].dutyId !== e.target.dataset.id) {
        this.data.delDutyList.push(this.data.dutyList[i]);
      }
    }
    this.setData({
      dutyList: this.data.delDutyList,
      addDutyList: this.data.delDutyList
    })
  },
  // 完成
  complate:function() {
    // TODO  还需做身份证号码的校验
    if (this.data.relationID === '') {
      wx.showToast({
        title: '请选择家庭角色',
        icon: 'none',
        duration:2000
      })
      return;
    } else if (this.data.insuredCardNum === '') {
      wx.showToast({
        title: '请填写被保人证件号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.checkCard === false) {
      wx.showToast({
        title: '请填写正确的被保人证件号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.insuredName === '') {
      wx.showToast({
        title: '请填写被保人姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.insuredSexId === '') {
      wx.showToast({
        title: '请选择被保人性别',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.insuredDate === '') {
      wx.showToast({
        title: '请选择被保人出生日期',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.isSamePerson === '') {
      wx.showToast({
        title: '请选择是否为同一人',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.holderCardNum === '') {
      wx.showToast({
        title: '请填写投保人证件号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.checkCard1 === false) {
      wx.showToast({
        title: '请填写正确的投保人证件号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.holderName === '') {
      wx.showToast({
        title: '请填写投保人姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    }else if (this.data.holderSexId === '') {
      wx.showToast({
        title: '请选择投保人性别',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.holderDate === '') {
      wx.showToast({
        title: '请选择投保人出生日期',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.insuredCompany === '') {
      wx.showToast({
        title: '请选择保险公司',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.insuranceName === '') {
      wx.showToast({
        title: '请填写保单名称',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.policyNum === '') {
      wx.showToast({
        title: '请填写保单号',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.validDate === '') {
      wx.showToast({
        title: '请选择生效日',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.insuredPerodVal === '') {
      wx.showToast({
        title: '请选择保险期间',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.insuredPerodVal !== '保至终身' && new Date(this.data.validDate + '').getTime() > new Date(this.data.insuredPerodVal + '').getTime()) {
      wx.showToast({
        title: '生效日不可大于保险期间',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.payWayId === '') {
      wx.showToast({
        title: '请选择缴费方式',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.periodMoney === '') {
      wx.showToast({
        title: '请填写每期保费',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.payStartDate === '') {
      wx.showToast({
        title: '请选择缴费开始日期',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.payWayId === 1 && this.data.payEndDate === '') {
      // 月缴时终止日期不可为空
      wx.showToast({
        title: '请选择缴费终止日期',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.payWayId === 2 && this.data.payEndDate === '') {
       // 年缴时终止日期不可为空
      wx.showToast({
        title: '请选择缴费终止日期',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.payWayId === 1 && this.data.payEndDate !== '' && new Date(this.data.payStartDate + '').getTime() > new Date(this.data.payEndDate + '').getTime()) {
      // 月缴时缴费开始日期不可大于缴费终止日期
      wx.showToast({
        title: '缴费开始日期不可大于缴费止日期哦!',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.payWayId === 2 && this.data.payEndDate !== '' && new Date(this.data.payStartDate + '').getTime() > new Date(this.data.payEndDate + '').getTime()) {
      // 年缴时缴费开始日期不可大于缴费终止日期
      wx.showToast({
        title: '缴费开始日期不可大于缴费止日期哦!',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.dutyList.length == 0) {
      wx.showToast({
        title: '请添加最少一项保障责任',
        icon: 'none',
        duration: 2000
      })
      return;
    } else{
      this.seveInsurance();
    }
  },
  seveInsurance:function() {
    var that = this;
    // 失效日 保险期间=终身 失效日=‘’  保险期间=选择的日期 失效日= 选择的日期
    // 保存接口  需要重新获取保险公司id
          // insuredCompanyId 通过保险名字取获取保险公司的id
          for (var i = 0; i < that.data.companyList.length; i++) {
            if (that.data.insuredCompany === that.data.companyList[i].companyName) {
              that.setData({
                insuredCompanyId: that.data.companyList[i].id
              })
              console.log('保险公司id===' + that.data.insuredCompanyId);
            }
          }
    var params = {
      billInfoParams:JSON.stringify({
        insuredName: that.data.insuredName, //被保人姓名
        insuredCertificateType: that.data.insuredCardId, //被保人证件类型id
        insuredCertificateNo: that.data.insuredCardNum,//被保人证件号码
        relationType: that.data.relationID,//家庭角色
        insuredSex: that.data.insuredSexId,//被保人性别
        insuredBirthday: that.data.insuredDate,//被保人出生日期
        isSamePerson: that.data.isSamePerson,//是否为同一人
        policyHolderName: that.data.holderName,	 //投保人姓名
        policyHolderCertificateNo: that.data.holderCardNum,	 		 //投保人证件号
        policyHolderCertificateType: that.data.holderCardId,	 	//投保人证件类型
        policyHolderSex: that.data.holderSexId,	 		 //投保人id
        policyHolderBirthday: that.data.holderDate,	 	//投保人出生日期
        beneficiaryName: that.data.beneficiaryName,	 		 //受益人姓名
        insuranceCompanyId: that.data.insuredCompanyId,	 		 //保险公司id
        billNo: that.data.policyNum,	 		 //保单号
        paymentUnit: that.data.payWayId, 		 //缴费方式
        payStartTime: that.data.payStartDate,	 		    //缴费初始日期
        payEndTime: that.data.payEndDate,	 		 //缴费终止日期
        insureMoney: that.data.periodMoney,	 		 //每期保费
        insureStartTime: that.data.validDate,		 		 //保险生效日
        isLifelong: that.data.insuredPerodVal == '保至终身' ? 0 : 1, 		 //保险有效期 终身为0 具体时间为1
        insureEndTime: that.data.insureEndTime,	 		 //保险失效时间
        waitingPeriod: that.data.waitIndex,//等待期
        customizeSafeguardParamsList: that.data.dutyList,//保障责任列表
        imageId: app.globalData.editJoinConfrim === false ? app.globalData.uploadImgInfo.data.imageId : that.data.editImgid,//保单id ，编辑状态下data里边的id ,上传为app.js中的
        billName: that.data.insuranceName,//保单名称
        policyHolderId: that.data.tbrId,//投保人id
        insuredId: that.data.bbrId, //被保人的id
        userId: app.globalData.whUserId, // userId
        billUploadType: that.data.billUploadType,
        brokerId: app.globalData.agentInfo.id
      })
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/bill',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data: params,
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 获取后台返回的保单id跳转到详情页
          app.globalData.uploadJoinDetail = true;
          wx.redirectTo({
             url: '../4-insurance-detail/4-insurance-detail?billId=' + data.data,
           })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.seveInsurance);
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
  // 点击家庭角色、选择、取消家庭角色
  clickRelation:function () {
    this.setData({
      showRelationList: !this.data.showRelationList
    })
  },
  // 选择家庭角色
  selecRelation:function (e) {
    this.setData({
      relationDefault: e.target.dataset.relation,
      clickRelationId: e.target.dataset.relation,
      clickRelationText: e.target.dataset.relationtext
    })
  },
  // 确定家庭角色
  ensureRelation:function() {
    this.setData({
      relationID: this.data.clickRelationId,
      relationText: this.data.clickRelationText,
      showRelationList: !this.data.showRelationList,
      hasRelation: false
    })
    console.log('家庭角色====' + this.data.relationText + ';;;;;;家庭角色id====' + this.data.relationID)
  },
  // 点击选择保险公司
  openLogo: function () {
    this.setData({
      showCompany: !this.data.showCompany
    })
  },
  // 选择保险公司
  selectCompany: function (e) {
    this.setData({
      companyDefault: e.target.dataset.id,
      clickCompantId: e.target.dataset.id,
      clickCompanyText: e.target.dataset.text
    })

  },
  // 确认保险公司
  ensureCompany: function () {
    this.setData({
      insuredCompanyId: this.data.clickCompantId,
      insuredCompany: this.data.clickCompanyText
    })
    this.openLogo();
  },
  // 选择被保人证件类型
  insuredCardPickerChange:function(e) {
    this.setData({
      insuredCardIndex: e.detail.value,
      insuredCardId: this.data.insuredCardIdArr[e.detail.value],  // 被保人证件类型id
      insuredCardText: this.data.insuredCardArr[e.detail.value], // 被保人证件类型文字
    })
    if (this.data.isSamePerson === 1) {
      this.setData({
        holderCardIndex: this.data.insuredCardId - 1,
        holderCardText: this.data.insuredCardText,
        holderCardId: this.data.insuredCardId,
      })
    }
    console.log('被保人证件类型id为===' + this.data.insuredCardId + ';;;值为' + this.data.insuredCardText);
  },
  // 被保人证件号码
  insuredCardInput:function(e) {
    // 判断是否为同一人
    if (e.detail.value === '') {
      this.setData({
        hasinsuredcadrVal: 0
      })
    } else {
      this.setData({
        insuredCardNum:e.detail.value,
        hasinsuredcadrVal:1
      })
    }
    if (this.data.isSamePerson === 1) {
      this.setData({
        holderCardNum: this.data.insuredCardNum
      })
    }
    console.log('被保人证件号码' + this.data.insuredCardNum);
  },
  insuredCardBlur:function() {
    this.checkCardNum(this.data.insuredCardNum, 1);
    // 通过身份证能否获取到被保人的信息
    if (this.data.checkCard === true) {
      // 身份证验证通过
      this.getInsuredInfo();
    }
  },
  // 获取被保人信息接口
  httpInsuredCardInfo:function(){
    var thats1 = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/bill/applicant/idCardVerify',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data: thats1.data.cardParams,
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          if (data.data === null) {
            thats1.setData({
              bbrId: '',//未查到信息被保人id
            })
          } else {
            thats1.setData({
              bbrId: data.data.id,//被保人id
              relationID: data.data.relationType,//家庭角色id
              insuredName: data.data.applicantName,//被保人姓名
              hasinsurednameVal: data.data.applicantName === '' ? 0 : 1,//被保人姓名是否为空样式
              insuredDate: data.data.applicantInfoBirthday,//被保人出生日期
            })
            // 被保人性别赋值
            if (data.data.applicantSex === '') {
              thats1.setData({
                insuredSexIndex: '',
                insuredSexId: ''
              })
            } else if (data.data.applicantSex === 0) { //女
              thats1.setData({
                insuredSexIndex: 1,
                insuredSexId: 0
              })
            } else if (data.data.applicantSex === 1) { // 男
              thats1.setData({
                insuredSexIndex: 0,
                insuredSexId: 1
              })
            }
            // 家庭角色赋值
            if (data.data.relationType === 5) {
              thats1.setData({
                relationText: '爸爸',
                hasRelation: false
              })
            } else if (data.data.relationType === 6) {
              thats1.setData({
                relationText: '妈妈',
                hasRelation: false
              })
            } else if (data.data.relationType === 7) {
              thats1.setData({
                relationText: '儿子',
                hasRelation: false
              })
            } else if (data.data.relationType === 8) {
              thats1.setData({
                relationText: '女儿',
                hasRelation: false
              })
            } else if (data.data.relationType === 9) {
              thats1.setData({
                relationText: '其他',
                hasRelation: false
              })
            } else if (data.data.relationType === 10) {
              thats1.setData({
                relationText: '本人',
                hasRelation: false
              })
            } else if (data.data.relationType === 11) {
              thats1.setData({
                relationText: '配偶',
                hasRelation: false
              })
            } else if (data.data.relationType === 12) {
              thats1.setData({
                relationText: '配偶爸爸',
                hasRelation: false
              })
            } else if (data.data.relationType === 13) {
              thats1.setData({
                relationText: '配偶妈妈',
                hasRelation: false
              })
            } else {
              thats1.setData({
                relationText: '',
                hasRelation: true
              })
            }
            // 判断与被保人是否为同一人
            if (thats1.data.isSamePerson === 1) {
              thats1.setData({
                isSamePerson: 1,
                holderCardIndex: thats1.data.insuredCardId - 1,
                holderCardText: thats1.data.insuredCardText,
                holderCardId: thats1.data.insuredCardId,
                holderCardNum: thats1.data.insuredCardNum,
                holderName: thats1.data.insuredName,
                holderSexIndex: thats1.data.insuredSexId == 0 ? 1 : 0,
                holderSexId: thats1.data.insuredSexId,
                holderDate: thats1.data.insuredDate,
                samePersonShow: true,
                checkCard1: thats1.data.checkCard // 投保人身份证验证是否通过与被保人一直
              })
            }
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(thats1.httpInsuredCardInfo());
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
  // 获取投保人信息接口
  httpHolderCardInfo:function() {
    var thats1 = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/bill/policy/idCardVerify',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data: thats1.data.holdercardParams,
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          if (data.data === null) {
            thats1.setData({
              tbrId:'',//投保人id
            })
          } else {
            thats1.setData({
            tbrId:data.data.id,//投保人id
            holderName: data.data.policyHolderName,//投保人姓名
            hasholderdnameVal: data.data.policyHolderName === '' ? 0 : 1,//投保人姓名为空
            holderDate: data.data.policyHolderBirthday,//投保人出生日期
          })
          // 投保人性别赋值
            if (data.data.policyHolderSex === '') {
              thats1.setData({
                holderSexIndex: '',
                holderSexId: ''
              })
            } else if (data.data.policyHolderSex === 0) {
              thats1.setData({
                holderSexIndex: 1,
                holderSexId: 0
              })
            } else if (data.data.policyHolderSex === 1) {
              thats1.setData({
                holderSexIndex: 0,
                holderSexId: 1
              })
          }
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(thats1.httpHolderCardInfo());
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
  // 通过被保人身份证号码获取姓名、性别、出生日期
  getInsuredInfo:function() {
    var that = this;
    that.setData({
      cardParams:{
        userId: app.globalData.whUserId,
        idCard: that.data.insuredCardNum
      }
    })
    // 证件号码不为空
    if (that.data.cardParams.idCard !== '') {
      that.httpInsuredCardInfo();
    }
  },
   // 通过投保人身份证号码获取姓名、性别、出生日期
  getHolderInfo:function() {
    var that = this;
    that.setData({
      holdercardParams: { 
        userId: app.globalData.whUserId,
        idCard: that.data.holderCardNum
      }
    })
     // 证件号码不为空
    if (that.data.holdercardParams.idCard !== '') {
      that.httpHolderCardInfo();
    }
   },
  // 投保人证件号码
  holderCardInput:function(e) {
    if (e.detail.value === '') {
      this.setData({
        hasholdercadrVal: 0
      })
    } else {
      this.setData({
        holderCardNum: e.detail.value,
        hasholdercadrVal: 1
      })
    }
    console.log('投保人证件号码' + this.data.holderCardNum);
  },
  // 投保人证件号码失去焦点
  holderCardBlur:function() {
    this.checkCardNum(this.data.holderCardNum, 2);
    if (this.data.checkCard1 === true) {
      // 身份证验证通过
      this.getHolderInfo();
    }
  },
  // 被保人姓名
  insuredNameInput:function(e) {
    if (e.detail.value === '') {
      this.setData({
        hasinsurednameVal: 0
      })
    } else {
      this.setData({
        insuredName: e.detail.value,
        hasinsurednameVal: 1
      })
    }
    if (this.data.isSamePerson === 1) {
      this.setData({
        holderName: this.data.insuredName
      })
    }
    console.log('被保人姓名' + this.data.insuredName);
  },
  // 投保人姓名
  holderNameInput: function (e) {
    if (e.detail.value === '') {
      this.setData({
        hasholderdnameVal: 0
      })
    } else {
      this.setData({
        holderName: e.detail.value,
        hasholderdnameVal: 1
      })
    }
    console.log('投保人姓名' + this.data.holderName);
  },
  // 选择被保人性别
  insuredSexPickerChange: function (e) {
    this.setData({
      insuredSexIndex: e.detail.value
    })
    if (e.detail.value === '1') { // 女
      this.setData({
        insuredSexId: 0
      })
    } else { // 男
      this.setData({
        insuredSexId: 1
      })
    }
    if (this.data.isSamePerson === 1) {
      this.setData({
        holderSexIndex: this.data.insuredSexId == 0 ? 1 : 0,
        holderSexId: this.data.insuredSexId,
      })
    }  
    console.log('被保人性别id为===' + this.data.insuredSexId)
  },
  // 受益人姓名
  benefitNameInput:function(e) {
    if (e.detail.value === '') {
      this.setData({
        hasbenefitnameVal: 0
      })
    } else {
      this.setData({
        beneficiaryName: e.detail.value,
        hasbenefitnameVal: 1
      })
    }
    console.log('投保人姓名' + this.data.beneficiaryName);
  },
  // 保单名称
  bdmcInput:function(e) {
    if (e.detail.value === '') {
      this.setData({
        hasbddmcVal: 0
      })
    } else {
      this.setData({
        insuranceName: e.detail.value,
        hasbddmcVal: 1
      })
    }
    console.log('保单名称' + this.data.insuranceName);
  },
  // 保单号
  bdhInput:function(e) {
    if (e.detail.value === '') {
      this.setData({
        hasbdhVal: 0
      })
    } else {
      this.setData({
        policyNum: e.detail.value,
        hasbdhVal: 1
      })
    }
    console.log('保单号' + this.data.policyNum);
  },
  // 每期保费
  bfInput:function(e) {
    if (e.detail.value === '') {
      this.setData({
        hasmqbfVal: 0
      })
    } else {
      this.setData({
        periodMoney: e.detail.value,
        hasmqbfVal: 1
      })
    }
    console.log('每期保费' + this.data.periodMoney);
  },
  // 选择被保人出生日期
  insuredDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      insuredDate: e.detail.value
    })
    if (this.data.isSamePerson === 1) {
      this.setData({
        holderDate: this.data.insuredDate
      })
    }
  },
  // 是否为同一人
  samePickerChange: function (e) {
    this.setData({
      sameIndex: e.detail.value
    })
    if (this.data.sameIndex === '1') {
      this.setData({
        isSamePerson: 0,
        samePersonShow: false
      })
    } else {
      // 同一人为是时，投保人信息与被保人信息一致并且不可进行修改
      this.setData({
        tbrId: '',//投保人id为空
        isSamePerson: 1,
        holderCardIndex: this.data.insuredCardId - 1,
        holderCardText: this.data.insuredCardText,
        holderCardId: this.data.insuredCardId,
        holderCardNum: this.data.insuredCardNum,
        holderName: this.data.insuredName,
        holderSexIndex: this.data.insuredSexId == 0? 1:0,
        holderSexId: this.data.insuredSexId,
        holderDate: this.data.insuredDate,
        samePersonShow:true,
        checkCard1: this.data.checkCard // 投保人身份证验证是否通过与被保人一直
      })
    }
  },
  // 选择投保人证件类型
  holderCardPickerChange:function(e) {
    this.setData({
      holderCardIndex: e.detail.value,
      holderCardId: this.data.insuredCardIdArr[e.detail.value],  // 投保人证件类型id
      holderCardText: this.data.holderCardArr[e.detail.value], // 投保人证件类型文字
    })
    console.log('投保人证件类型id为===' + this.data.holderCardId + ';;;值为' + this.data.holderCardText);
  },
  // 选择投保人性别
  holderSexPickerChange: function (e) {
    this.setData({
      holderSexIndex: e.detail.value
    })
    if (e.detail.value === '1') { // 女
      this.setData({
        holderSexId: 0
      })
    } else { // 男
      this.setData({
        holderSexId: 1
      })
    }
    console.log('被保人性别id为===' + this.data.holderSexId)
  },
  // 选择投保人出生日期
  holderDateChange:function(e) {
    this.setData({
      holderDate: e.detail.value
    })
  },
  // 选择生效日
  validDateChange:function(e) {
    this.setData({
      validDate: e.detail.value
    })
  },
  // 选择缴费方式
  payWayPickerChange:function(e) { // 月交=1 年缴2 一次性缴清3
    this.setData({
      payWayIndex: e.detail.value
    })
    if (e.detail.value === '0') {
      this.setData({
        payWayId:1,
        payEndDate: '',
        showPayEnd: true
      })
    } else if (e.detail.value === '1') {
      this.setData({
        payWayId: 2,
        payEndDate: '',
        showPayEnd: true
      })
    } else if (e.detail.value === '2') {
       // 如果是一次性缴清，隐藏缴费终止日期  缴费终止日期=缴费开始日期
      this.setData({
        payWayId: 3,
        payEndDate: this.data.payStartDate,
        showPayEnd: false
      })
    }
  },
  // 选择缴费开始日期
  payStartDateChange:function(e) {
    this.setData({
      payStartDate: e.detail.value
    })
    // 如果是一次性缴清，隐藏缴费终止日期  缴费终止日期=缴费开始日期
    if (this.data.payWayId === 3) {
      this.setData({
        payEndDate: this.data.payStartDate
      })
    }
  },
  // 选择缴费终止日期
  payEndDateChange:function(e) {
    this.setData({
      payEndDate: e.detail.value
    })
  },
  // 选择自定义保险期间
  periodDateChange:function(e) {
    this.setData({
      periodDate: e.detail.value
    })
    this.setData({
      insuredPerodVal: this.data.periodDate,
      insureEndTime: this.data.periodDate
    })
    this.selectInsuredPeriod();
  },
  selectLifeLong:function() {
    this.setData({
      insuredPerodVal: '保至终身',
      insureEndTime:''
    })
    this.selectInsuredPeriod();
  },
  // 保险期间
  selectInsuredPeriod:function() {
    this.setData({
      showInsuredPeriod: !this.data.showInsuredPeriod
    })
  },
  // 选择等待期
  waitDayPickerChange:function(e) {
    this.setData({
      waitIndex: e.detail.value
    })
  },
  // 身份证号码校验
  checkCardNum: function (num,type) {
    // type 为 1 ===被保人身份证  type 为 2 === 投保人身份证
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
        if (type === 1) {
          this.setData({
            checkCard: false
          })
        } else if (type === 2) {
          this.setData({
            checkCard1: false
          })
        }
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
          if (type === 1) {
            this.setData({
              checkCard: true
            })
          } else if (type === 2) {
            this.setData({
              checkCard1: true
            })
          }
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
            if (type === 1) {
              this.setData({
                checkCard: false
              })
            } else if (type === 2) {
              this.setData({
                checkCard1: false
              })
            }
            return;
          }
          // 身份证校验通过的标识
          if (type === 1) {
            this.setData({
              checkCard: true
            })
          } else if (type === 2) {
            this.setData({
              checkCard1: true
            })
          }
        }
      }
    } else {
      wx.showToast({
        title: '您输入的身份证号码有误',
        icon: 'none',
        duration: 2000
      });
      if (type === 1) {
        this.setData({
          checkCard: false
        })
      } else if (type === 2) {
        this.setData({
          checkCard1: false
        })
      }
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
      if (type === 1) {
        this.setData({
          checkCard: false
        })
      } else if (type === 2) {
        this.setData({
          checkCard1: false
        })
      }
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
        if (type === 1) {
          this.setData({
            checkCard: false
          })
        } else if (type === 2) {
          this.setData({
            checkCard1: false
          })
        }
        return;
      }
    } else if (Number(borthMouth) === 4 || Number(borthMouth) === 6 || Number(borthMouth) === 9 || Number(borthMouth) === 11) {
      if (Number(borthDay) > 30) {
        wx.showToast({
          title: '您输入的身份证号码有误',
          icon: 'none',
          duration: 2000
        })
        if (type === 1) {
          this.setData({
            checkCard: false
          })
        } else if (type === 2) {
          this.setData({
            checkCard1: false
          })
        }
        return;
      }
    } else if (Number(borthMouth) === 2) {
      if (Number(borthDay) > 28) {
        wx.showToast({
          title: '您输入的身份证号码有误',
          icon: 'none',
          duration: 2000
        })
        if (type === 1) {
          this.setData({
            checkCard: false
          })
        } else if (type === 2) {
          this.setData({
            checkCard1: false
          })
        }
        return;
      }
    } else {
      wx.showToast({
        title: '您输入的身份证号码有误',
        icon: 'none',
        duration: 2000
      })
      if (type === 1) {
        this.setData({
          checkCard: false
        })
      } else if (type === 2) {
        this.setData({
          checkCard1: false
        })
      }
    }
  }
})
