//index.js
//获取应用实例
const app = getApp()

Page({
  onPullDownRefresh: function () {
    this.setData({
      userId: app.globalData.whUserId
    })
    this.customerDetail(); 
  },
  data: {
    nowTime:'',
    hasFamilyMember: false,
    hasPolicy: false,
    showRealMask: false,
    showMask:false,
    checkCard: '', //身份证校验是否通过 true 为通过
    showSelect: '',
    memberName: '',
    memberCarNum: '',
    familyMenber:[
      {
        relation:'爸爸',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_father.png'
      },
      {
        relation: '妈妈',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_mather.png'
      },
      {
        relation: '儿子',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_son.png'
      },
      {
        relation: '女儿',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_daughter.png'
      },
      {
        relation: '其他',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_other.png'
      },
      {
        relation: '本人',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_self.png'
      },
      {
        relation: '配偶',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_wife.png'
      },
      {
        relation: '配偶爸爸',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_father.png'
      },
      {
        relation: '配偶爸爸',
        src: 'http://oss.baoxian.xujinkeji.com/broker/insured_mather.png'
      }
    ],
    userId: '',
    detailImgUrl: '',
    nickname: '',
    detailTel: '',
    detailBx:'',
    detailBf: '',
    detailBe: '',
    familyMenmberList: [], // 家庭成员列表
    insurancrList: [], // 保单列表
    customerUploadBillModels: []//用户托管保单
  },
  // 页面加载
  onLoad: function (res) {
    // 获取用户的userid
    var that = this;    
    that.setData({
      userId: res.userid
    })
    app.globalData.whUserId = res.userid;
    that.customerDetail(); 
  },
  onShow:function() {
    // 新增、编辑保单刷新页面
    if (app.globalData.uploadJoinDetail === true) {
      app.globalData.uploadJoinDetail = false;
      this.customerDetail();
    }
  },
  // 客户详情接口
  customerDetail:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customerDetail/query/' + app.globalData.agentInfo.id + '/' + app.globalData.whUserId,
      method: 'get',
      header: {'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data.data.custmerDetail;
        if (res.data.businessCode === '0000') {
          wx.stopPullDownRefresh();
          // 页面绑定数据
          that.setData({
            detailImgUrl: data.headImageUrl,
            nickname: data.nickname,
            detailTel: data.phoneNo,
            detailBx: data.billNum,
            detailBf: data.premium,
            detailBe: data.coverage
          })
            // 都为空则显示上传保单
          if (data.customerBillModels === null && data.customerUploadBillModels === null) {
              that.setData({
                hasPolicy:true,
                insurancrList:[],
                customerUploadBillModels:[]
              })
          } else if (data.insurancrList === null)  {
            that.setData({
              hasPolicy: false,
              insurancrList: [],
              customerUploadBillModels: data.customerUploadBillModels
            })
          } else if (data.customerUploadBillModels === null) {
            that.setData({
              hasPolicy: false,
              insurancrList: data.customerBillModels,
              customerUploadBillModels: []
            })
          } else{
            that.setData({
              hasPolicy: false,
              insurancrList: data.customerBillModels,
              customerUploadBillModels: data.customerUploadBillModels
            })
          }
          // 将家庭成员列表的家庭角色数字值转换成文字
          if (data.customerMemberModels !== null) {
            for (var i = 0; i < data.customerMemberModels.length; i++) {
              if (data.customerMemberModels[i].role === 5) {
                data.customerMemberModels[i].role = '爸爸'
              } else if (data.customerMemberModels[i].role === 6) {
                data.customerMemberModels[i].role = '妈妈'
              } else if (data.customerMemberModels[i].role === 7) {
                data.customerMemberModels[i].role = '儿子'
              } else if (data.customerMemberModels[i].role === 8) {
                data.customerMemberModels[i].role = '女儿'
              } else if (data.customerMemberModels[i].role === 9) {
                data.customerMemberModels[i].role = '其他'
              } else if (data.customerMemberModels[i].role === 10) {
                data.customerMemberModels[i].role = '本人'
              } else if (data.customerMemberModels[i].role === 11) {
                data.customerMemberModels[i].role = '配偶'
              } else if (data.customerMemberModels[i].role === 12) {
                data.customerMemberModels[i].role = '配偶爸爸'
              } else if (data.customerMemberModels[i].role === 13) {
                data.customerMemberModels[i].role = '配偶爸爸'
              }
            }
            that.setData({
              familyMenmberList: data.customerMemberModels,
              hasFamilyMember:false
            })
          } else {
            that.setData({
              familyMenmberList:[],
              hasFamilyMember: true
            })
          }
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(that.customerDetail());
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

  // 用户托管保单
  editState: function (e) {
    var that = this;
    var params = {
      billId: e.target.dataset.id,//保单id
      billImgUrl:e.target.dataset.url,//保单地址
      userId: app.globalData.whUserId,
      brokerId: app.globalData.agentInfo.id
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/bill/status',
      method: 'POST',
      data:params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // data.data为0=无人编辑 1=有人编辑
            //将图片的id和地址放到app.js
          if (data.data === 0) {
            // 跳转至确认结果页面 获取保单id,保单url
            app.globalData.editJoinConfrim = true;
            app.globalData.editImgid = e.target.dataset.id;
            app.globalData.editImgurl = e.target.dataset.url;
            wx.navigateTo({
              url: '../7-confrim-msg/7-confrim-msg',
            })
          } else if (data.data == 1) {
            // 弹出提示有人正在编辑
            that.checkWhMask();
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.editState());
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
  // 获取家庭成员的姓名、身份证号码
  userNameInput: function (e) {
    this.setData({
      memberName: e.detail.value
    })
  },
  guaranteePlan:function() {
    wx:wx.showToast({
      title: '此功能暂时未开启...',
      icon: 'none',
      duration: 2000
    })
  },
  passWdInput: function (e) {
    this.setData({
      memberCarNum: e.detail.value,
      checkCard: ''
    })
  },
  // 选择家庭成员
  checkRelation:function(res) {
    this.setData({
      showSelect: res.target.dataset.index // 为索引，具体的关系类型是从5开始。所以加5
    })
  },
  // 确认家庭成员
  addMember:function() {
    if (this.data.showSelect === '') {
      wx.showToast({
        title: '请选择家庭成员角色',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.memberName === '') {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 2000
      })
      return;
    } else if (this.data.memberCarNum === '') {
      wx.showToast({
        title: '请填写身份证号码',
        icon: 'none',
        duration: 2000
      })
      return;
    } else {
      // 校验身份证格式
      this.checkCardNum(this.data.memberCarNum);
      if (this.data.checkCard === true) {
        //身份证校验通过
        this.addFamilyMember();
      }
    }
  },
  // 添加家庭成员接口
  addFamilyMember:function() {
    var that = this;
    var params = {
      applicantName: that.data.memberName,	 //被保人姓名
      applicantCardType: 1,		 //被保人证件类型  1:身份证
      applicantCardNo: that.data.memberCarNum,	  //被保人身份证号
      relationType: that.data.showSelect + 5,	 		 //被保人与投保单的关系
      userId: that.data.userId
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customerMember/add',
      method: 'POST',
      data:params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          wx.showToast({
            title: '新增家庭成员成功',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            showRealMask:false, 
            memberName: '',
            memberCarNum: '',
            showSelect: ''
          })
          that.customerDetail();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.addFamilyMember());
        } else {
          wx.showToast({
            title:data.msg,
            icon:'none',
            duration:2000
          })
        }
      }
    })
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
          this.setData({
            checkCard:true
          })
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
          this.setData({
            checkCard: true
          })
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
  goInsuranceDetail:function(e) {
    wx.navigateTo({
      url: '../4-insurance-detail/4-insurance-detail?billId=' + e.target.dataset.id,
    })
  },
  goMemberDetail:function(e) {
    // userId
    wx.navigateTo({
      url: '../6-family-member-detail/6-family-member-detail?userId=' + this.data.userId + '&id=' + e.target.dataset.id,
    })
  },
  // 右上角添加家庭成员
  checkFamilyMask:function() {
    this.setData({
      showRealMask: !this.data.showRealMask
    })
  },
  // 保单正在维护中
  checkWhMask:function() {
    this.setData({
      showMask: !this.data.showMask
    })
  },
  call:function(e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel,
      success:function() {
        // 添加维护记录
        that.getNowTime();
        that.addWeihuNotes();
      }
    })
  },
  getNowTime:function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    this.setData({
      nowTime: year + '-' + month + '-' + day + '-' + hour + ':' + minute + ':' + second
    })
  },
  addWeihuNotes:function() {
    var that = this;
    var params = {
      vindicateTime: that.data.nowTime,
      type: 2,
      userId: app.globalData.whUserId,
      brokerId: app.globalData.agentInfo.id
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customer/add',
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.addWeihuNotes());
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
  redPaket:function(e) {
    app.goNewPage(e);
  },
  goWHNotes: function (e) {
    app.goNewPage(e);
  },
  // 选择保单
  chooseImg:function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '保单正在识别中...',
          mask:true
        })
        wx.uploadFile({
          url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/bill/picture',
          filePath: tempFilePaths[0],
          header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
          name: 'fileImg',
          formData: {
            userId: that.data.userId
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            if(data.businessCode === '0000') {
              wx.hideLoading();
              app.globalData.uploadImgInfo = data; // 上传图片成功后后台返回的信息
                wx.navigateTo({
                  url: '../5-insurance-upload/5-insurance-upload',
                })
            } else {
              wx.showToast({
                title: data.msg,
                icon:'none',
                duration:2000
              })
            }
          }
        })
      }
    })
  }
})
