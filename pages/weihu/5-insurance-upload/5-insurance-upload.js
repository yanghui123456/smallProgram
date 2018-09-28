//获取应用实例
const app = getApp()

Page({
  data: {
    animationData: {},
    showComplate: true,
    showClose: false,
    spanWidth: 7.3, // 默认span的宽度
    // 图片的宽和高
    imgWidth: '',
    imHeight: '',
    imgSrc: '',
    // 描边元素的宽高和位置、文字内容
    coordinateList:[],
    selectEl: '',
    // 确认字体的背景颜色
    ensureColor: true,
    questionsList: ['被保险人证件号', '被保人姓名', '投保人证件号', '投保人姓名', '保险公司', '保险名称', '保险生效日', '保险失效日(终身型请选择跳过)', '每期保费', '首次缴费日期', '保单号'],  // type从1开始
    questionText:'',
    questionIndex: 0,
    resultList: [],  // 选中结果的list
    addListItem: 0 // 往questionsList中追加保障责任的条数
  },
  // 页面加载
  onLoad: function (res) {
    // 设置图片的宽高为原始图片的宽和高 设置默认问题项
    // 上传图片成功后的信息
    var that = this;
    var imgInfo = app.globalData.uploadImgInfo;
    that.setData({
      imgSrc: imgInfo.data.imageName, // 图片地址
      imgWidth: imgInfo.data.imageSize.width, // 图片宽
      imgHeight: imgInfo.data.imageSize.height, //图片高
      questionText: this.data.questionsList[this.data.questionIndex],
      coordinateList: imgInfo.data.wordsResult //描边的元素
    })
    app.globalData.editImgurl = imgInfo.data.imageName;
  },
  // 返回上一个页面
  goPrev:function() {
    wx.navigateBack({
      delta: 1
    })
  },
  // 选中描边元素
  clickbox:function(res) {
    // 描边颜色背景色，确定按钮背景色、让resultList数组中最后一项等于选中的值
    var newResultList = this.data.resultList;
    var selectText = res.target.dataset.text;
    newResultList[this.data.questionIndex] = selectText;
    this.setData({
      selectEl:res.target.dataset.index,
      ensureColor: false,
      resultList: newResultList
    })
  },
  // 确定按钮
  ensure:function() {
    // 未选中给出提示
    if (this.data.resultList.length === this.data.questionIndex) {
      wx.showToast({
        title: '请选择' + this.data.questionsList[this.data.questionIndex],
        icon: 'none',
        duration: 2000
      })
    } else {
      this.animations();
      // 点击确定按钮索引加1，确认按钮颜色去掉、更换问题,清空选中的元素背景色
       this.setData({
         questionIndex: this.data.questionIndex + 1,
         ensureColor: true,
         selectEl: '',
         showClose: true,
        
       })
      //  问题数组列表索引小于10
       if (this.data.questionIndex <= 10) {
         this.setData({
           questionText: this.data.questionsList[this.data.questionIndex],
           spanWidth: this.data.spanWidth + 7.3
         })
       } else {
        //  问题数组列表索引大于10 往问题列表追加一项问题 创建一个新数组为问题列表数组。往新的数组中追加一项问题，把新数组赋值给原数组
         if (this.data.questionIndex % 2 === 0) {
           var newQuestionList = this.data.questionsList;
           newQuestionList[this.data.questionIndex] = '保险责任' + this.data.addListItem + '对应的保障额度';
           this.setData({
             questionsList: newQuestionList,
             showComplate: false // 显示完成按钮
           })
           this.setData({
             questionText: this.data.questionsList[this.data.questionIndex],
           })
         } else {
           this.setData({
             addListItem: this.data.addListItem + 1,
           })
           var newQuestionList1 = this.data.questionsList;
           newQuestionList1[this.data.questionIndex] = '保险责任' + this.data.addListItem;
           this.setData({
             questionsList: newQuestionList1,
             showComplate: false
           })
           this.setData({
             questionText: this.data.questionsList[this.data.questionIndex],
           })
         }
       }
    }
  },
  // 动画
  animations:function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear',
      delay: 0
    })
    that.animation = animation
    animation.translateY(70).step()
    that.setData({
      animationData: animation.export()
    }),
    setTimeout(function () {
      animation.translateY(0).step()
      that.setData({
        animationData: animation.export()
      })
    }, 300)
  },
  // 完成
  complated:function() {
    var that = this;
    // 将前11项处理成对象，从1-11的type值对应的数组的值
    console.log(that.data.resultList); // 所有选择答案的数组
    var questionsList = that.data.resultList.splice(0, 11);
    var baseInfo = [];
    var duty = []; // 传给后台的保障责任和对应金额数组
    for (var i = 0; i < questionsList.length; i++) {
      baseInfo.push({ type: Number([i]) + 1, words: questionsList[i] });
    }
    console.log(baseInfo); // 传给后台的前11项
    console.log(that.data.resultList); // 除了前11项外的所有选择答案的数组
    // 将选择完毕的答案数组的保障责任剔除，处理成数组的格式
    var dutyList = []; // 保障责任列表
    var numList = []; // 保障金额列表
    var emptyObj;
    // 判断剩余的数组长度是不是偶数，不为偶数删除该数组最后一项
    if (that.data.resultList.length % 2 !== 0) {
      var newResultList = that.data.resultList;
      newResultList.pop();
      that.setData({
        resultList: newResultList
      })
    }
    console.log(that.data.resultList);
    for (var i = 0; i < that.data.resultList.length; i++) {
      if (i % 2 === 0) {
        dutyList.push(that.data.resultList[i]);
      } else {
        numList.push(that.data.resultList[i]);
      }
    }
    for (var j = 0; j < dutyList.length; j++) {
      emptyObj = {};
      emptyObj.name = dutyList[j];
      duty.push(emptyObj);
    }
    for (var k = 0; k < duty.length; k++) {
      duty[k].sum = numList[k];
      }
    console.log(duty);// 传给后台的保障责任
    // 保单信息上传接口
    var params = {
      params:JSON.stringify({
        baseInfo: baseInfo,
        duty: duty,
        imageId: app.globalData.uploadImgInfo.data.imageId
      })
    };
    console.log(params);
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/bill/personal',
      method: 'POST',
      data: params,
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        console.log(data);
        if (data.businessCode === '0000') {
          console.log('成功');
          app.globalData.confrimMsg = data.data;
          app.globalData.editJoinConfrim === false;
          wx.redirectTo({
            url: '../7-confrim-msg/7-confrim-msg'
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
  },
  // 跳过
  jump:function() {
      this.animations();
      // 数组中的该项为空，将原数组重新赋值
      var newResultList1 = this.data.resultList;
      var selectText1 = '';
      newResultList1[this.data.questionIndex] = selectText1;
      this.setData({
        resultList: newResultList1,
        questionIndex: this.data.questionIndex + 1,
        selectEl: '',
        showClose: true,
        ensureColor: true,
      })
      if (this.data.questionIndex <= 10) {
        this.setData({
          questionText: this.data.questionsList[this.data.questionIndex],
          spanWidth: this.data.spanWidth + 7.3
        })
      } else {
        if (this.data.questionIndex % 2 === 0) {
          var newQuestionList2 = this.data.questionsList;
          newQuestionList2[this.data.questionIndex] = '保险责任' + this.data.addListItem + '对应的保障额度';
          this.setData({
            questionsList: newQuestionList2,
            showComplate: false // 显示完成按钮
          })
          this.setData({
            questionText: this.data.questionsList[this.data.questionIndex],
          })
        } else {
          this.setData({
            addListItem: this.data.addListItem + 1,
          })
          var newQuestionList3 = this.data.questionsList;
          newQuestionList3[this.data.questionIndex] = '保险责任' + this.data.addListItem;
          this.setData({
            questionsList: newQuestionList3,
            showComplate: false
          })
          this.setData({
            questionText: this.data.questionsList[this.data.questionIndex],
          })
      }
    }
  },
  // 后退
  goBack:function() {
    console.log(this.data.questionIndex);
    this.animations();
    // 索引减1、删除数组中最后一项
    // 设置span的宽度
    // if (this.data.questionIndex <= 10) {
    //   this.setData({
    //     spanWidth: this.data.spanWidth - 7.3
    //   })
    // }
    // var newResultList3 = this.data.resultList;
    // newResultList3.pop();
    // this.setData({
    //   resultList: newResultList3,
    //   questionIndex: this.data.questionIndex - 1,
    //   ensureColor: true,
    //   selectEl: '',
    // })
    // this.setData({
    //   questionText: this.data.questionsList[this.data.questionIndex]
    // })
    // if (this.data.questionIndex === 0) {
    //   wx.navigateBack({
    //     delta: 1,
    //   })
    //   this.setData({
    //     showClose: false
    //   })
    // } else if (this.data.questionIndex <= 10) {
    //   this.setData({
    //     showComplate: true,
    //     addListItem: 0,
    //   })
    // }
    if (this.data.questionIndex <= 10 && this.data.questionIndex !== 0) {
      this.setData({
        spanWidth: this.data.spanWidth - 7.3,
        showComplate: true,
        addListItem: 0,
      })
      var newResultList3 = this.data.resultList;
      newResultList3.pop();
      this.setData({
        resultList: newResultList3,
        questionIndex: this.data.questionIndex - 1,
        ensureColor: true,
        selectEl: '',
      })
      this.setData({
        questionText: this.data.questionsList[this.data.questionIndex]
      })
    } else if (this.data.questionIndex === 0) {
      wx.navigateBack({
        delta: 1,
      })
      this.setData({
        showClose: false
      })
    }
    console.log(this.data.resultList);
    console.log(this.data.questionIndex);
  }
})
