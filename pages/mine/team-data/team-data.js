// pages/mine/team-data/team-data.js
let Charts = require('../../../utils/wxcharts.js');
const app = getApp();
Page({
  data: {
    activeTab: 1,
    activeDays:7,
    windowWidth:'',
    nowTime:'',
    // 后台需要把所有的数据都给到，否则展示会有问题
    showAreaBtn:false,
    mokeArea1:[],
    mokeArea:[],
    mokeArea2:[
      {
       'regionName':'北京',
       'count':1000,
       'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '长春',
        'count': 500,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '吉林',
        'count': 20,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '黑龙江',
        'count': 1000,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '哈尔滨',
        'count': 500,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '河南',
        'count': 20,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '湖北',
        'count': 1000,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '湖南',
        'count': 500,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '衡水',
        'count': 20,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '张家口',
        'count': 1000,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '保定',
        'count': 500,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '唐山',
        'count': 20,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '天津',
        'count': 1000,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '上海',
        'count': 500,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '石家庄',
        'count': 20,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '邢台',
        'count': 1000,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '承德',
        'count': 500,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '厦门',
        'count': 20,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '海口',
        'count': 1000,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '福建',
        'count': 500,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '新疆',
        'count': 20,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '西藏',
        'count': 1000,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '广西',
        'count': 500,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      },
      {
        'regionName': '广州',
        'count': 20,
        'number': ''//计算后的长度百分比 ,后台返回空即可
      }
    ],
    // 历史记录
    customerCount:'',
    visitCount:'',
    ipVisitCount:'',
    ipVistitNumber:'',
    trusteeshipVistiCustomer:'',
    trusteeshipVisitNumber:'',
    percentConversion:'',
    billCount:'',
    // 用户画像
    averageBill:'',
    averagePremium:'',
    // 性别数字
    man:'',
    woman:'',
    unknown:'',
    // 性别百分比
    manPercentage:'',
    womanPercentage:'',
    unknownPercentage:'',
    // 性别圆
    mancircular:'',
    womancircular:'',
    unknowncircular:'',
    visitorCountToday:'',
    startPage:1,
    endPage:'',
    allChartData:'',
    timeList:[],
    countList1:[],
    countList2: [],
    sevenTime:[], // 7天时间数组
    sevenNewCount:[],
    sevenOldCount:[],
    shiwuTime: [],// 15天时间数组
    shiwuNewCount:[],
    shiwuOldCount:[]
  },
  onLoad: function (options) {
    // 获取页面的宽度
    var that = this;
    that.getNowTime();
    wx.getSystemInfo({
      success: function (res) {
        var canvasWidth = res.windowWidth;
        that.setData({
          windowWidth: canvasWidth
        })
        that.getAllData();
      }
    })
    that.getHistoryData();
    that.getUserSex();
    that.getUserArea();
  },
  getNowTime: function () {
    var date = new Date();
    var year = date.getFullYear();
    var mouth = date.getMonth() + 1;
    var day = date.getDate();
    this.setData({
      nowTime: year + '年' + mouth + '月' + day + '日'
    })
  },
  // 历史统计
  getHistoryData:function(){
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/broker/team/history/count',
      method: 'POST',
      data: {},
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            customerCount: data.data.customerCount,
            visitCount: data.data.visitCount,
            visitNumber: data.data.visitNumber,
            ipVisitCount: data.data.ipVisitCount,
            ipVistitNumber: data.data.ipVistitNumber,
            trusteeshipVistiCustomer: data.data.trusteeshipVistiCustomer,
            trusteeshipVisitNumber: data.data.trusteeshipVisitNumber,
            percentConversion: data.data.percentConversion,
            billCount: data.data.billCount
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getHistoryData());
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
  },
  // 用户画像，性别分布、保险数据
  getUserSex:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/broker/team/user/portray',
      method: 'POST',
      data: {},
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            averageBill: data.data.averageBill,
            averagePremium: data.data.averagePremium,
            man: data.data.man,
            woman: data.data.woman,
            unknown: data.data.unknown
          })
          // 男、女、未知都为0的情况下会是NaN，排除都为0
          if (that.data.man == 0 && that.data.woman == 0 && that.data.unknown == 0) {
            that.setData({
              manPercentage: 0,
              womanPercentage:0,
              unknownPercentage:0,
              mancircular:33.3,
              womancircular:33.3,
              unknowncircular:33.3,
            })
          } else {
            // 小数保留两位
            that.setData({
              manPercentage: ((that.data.man / (that.data.man + that.data.unknown + that.data.woman)) * 100).toFixed(2),
              womanPercentage: ((that.data.woman / (that.data.man + that.data.unknown + that.data.woman)) * 100).toFixed(2),
              unknownPercentage: ((that.data.unknown / (that.data.man + that.data.unknown + that.data.woman)) * 100).toFixed(2),
              mancircular: that.data.man,
              womancircular: that.data.woman,
              unknowncircular: that.data.unknown,
            })
          }
          that.sexChart();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getUserSex());
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
  },
  // 用户画像，地区分布
  getUserArea:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/broker/team/user/portray/region',
      method: 'POST',
      data: {},
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          if (data.data.teamRegionModels.length == 0) {
            that.setData({
              showAreaBtn:false,
              mokeArea: data.data.teamRegionModels
            })
          } else {
            that.setData({
              showAreaBtn: true,
              endPage: Number(Math.ceil((data.data.totalCount) / 10)),
              mokeArea: data.data.teamRegionModels
            })
            that.lengthList();
          }
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getUserArea());
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
  },
  // 计算地区分布图长度百分比
  lengthList:function() {
    this.setData({
      mokeArea1: this.data.mokeArea
    })
    for (var i = 0; i < this.data.mokeArea1.length; i++) {
      if (i == 0) {
        this.data.mokeArea1[0].number = 100;
      } else {
        this.data.mokeArea1[i].number = this.data.mokeArea1[i].count * 100 / this.data.mokeArea1[0].count;
      }
    }
    // mokeArea1,计算长度后的百分比的数组，取前10条 ，先判断数组长度是否大于10
    if (this.data.mokeArea1.length <= 10) {
      this.setData({
        mokeArea: this.data.mokeArea1
      })
    } else {
      this.setData({
        mokeArea: this.data.mokeArea1.slice(0, 10)
      })
    }
  },
  pageAeduce:function() {
    // 判断是不是第一页，是的话给出提示
    if (this.data.startPage == 1) {
        wx.showToast({
          title: '已经是第一页',
          icon:'none',
          duration:2000
        })
    } else {
      this.setData({
        startPage: this.data.startPage - 1,
        mokeArea: this.data.mokeArea1.slice(((this.data.startPage -1) * 10) - 10, (this.data.startPage-1) * 10)
      })
    }
  },
  pageAdd:function() {
    // 判断是不是最后一页，是的话给出提示
    if (this.data.startPage == this.data.endPage) {
      wx.showToast({
        title: '已经是最后一页',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        startPage: this.data.startPage + 1,
        mokeArea: this.data.mokeArea1.slice(((this.data.startPage + 1) * 10) - 10, (this.data.startPage + 1) * 10)
      })
    }
  },
  // 性别图表
  sexChart:function() {
    var that = this;
    new Charts({
      animation: true,
      canvasId: 'canvas3',
      type: 'ring',
      extra: {
        ringWidth: 35,
        pie: {
          offsetAngle: -45
        }
      },
      series: [{
        name: '成交量1',
        data: that.data.mancircular,
        stroke: false,
        color: '#1D96FF'
      }, {
        name: '成交量2',
        data: that.data.unknowncircular,
        stroke: false,
        color: '#E2E2E2'
      }, {
        name: '成交量3',
        data: that.data.womancircular,
        stroke: false,
        color: '#FF7C89'
      }],
      disablePieStroke: false,
      width: 170,
      height: 200,
      dataLabel: false,
      legend: false,
      padding: 0
    });
  },
  // 近7天和15天图表
  getAllData:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/broker/team/trend',
      method: 'POST',
      data: {
        brokerTeamId: app.globalData.teamData.brokerTeamId // 团队id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
         that.setData({
           visitorCountToday: data.data.visitorCountToday,
           allChartData: data.data.brokerTeamVisitorModelList
         })
          console.log(that.data.allChartData);
          // sevenTime: '', // 7天时间数组
            // shiwuTime: ''
        //  将后台返回的所有的数据，分成一个7天时间，15天时间，7天数据，15天数据
          for (var i = 0; i < that.data.allChartData.length;i++) {
            that.data.shiwuTime.push(that.data.allChartData[i].day);
            that.data.shiwuNewCount.push(that.data.allChartData[i].newVisitorCount);
            that.data.shiwuOldCount.push(that.data.allChartData[i].oldVisitorCount);
          }
          that.setData({
            sevenTime: that.data.shiwuTime.slice(0,8),
            sevenNewCount: that.data.shiwuNewCount.slice(0,8),
            sevenOldCount: that.data.shiwuOldCount.slice(0, 8),
            timeList: that.data.shiwuTime.slice(0, 8),
            countList1: that.data.shiwuNewCount.slice(0, 8),
            countList2: that.data.shiwuOldCount.slice(0, 8),
          })
          console.log(that.data.shiwuTime);
          console.log(that.data.shiwuNewCount);
          console.log(that.data.shiwuOldCount);
          console.log(that.data.sevenNewCount);
          console.log(that.data.sevenOldCount);
          that.chart1();
          that.chart2();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getAllData());
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
  chart1:function() {
    var that = this;
    new Charts({
      canvasId: 'areaCanvas',
      type: 'area',
      categories: that.data.timeList,
      animation: true,
      series: [{
        name: '新客户',
        data: that.data.countList1,
        format: function (val) {
          return val.toFixed(2) + '人';
        },
      }],
      yAxis: {
        title: '访问人数(人)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        fontColor: '#8085e9',
        gridColor: '#8085e9',
        titleFontColor: '#f7a35c'
      },
      xAxis: {
        fontColor: '#7cb5ec',
        gridColor: '#7cb5ec'
      },
      extra: {
        legendTextColor: '#cb2431'
      },
      width: this.data.windowWidth,
      height: 200
    });
  },
  chart2: function () {
    var that = this;
    new Charts({
      canvasId: 'areaCanvas1',
      type: 'area',
      categories: that.data.timeList,
      animation: true,
      series: [{
        name: '老客户',
        data: that.data.countList2,
        format: function (val) {
          return val.toFixed(2) + '人';
        },
      }],
      yAxis: {
        title: '访问人数(人)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        fontColor: '#8085e9',
        gridColor: '#8085e9',
        titleFontColor: '#f7a35c'
      },
      xAxis: {
        fontColor: '#7cb5ec',
        gridColor: '#7cb5ec'
      },
      extra: {
        legendTextColor: '#cb2431'
      },
      width: this.data.windowWidth,
      height: 200
    });
  },
  tab:function(e) {
    this.setData({
      activeTab: e.target.dataset.tab
    })
    // 重新加载图表，否则不显示
    if (e.target.dataset.tab == 1) {
      this.chart1();
      this.chart2();
    } else if (e.target.dataset.tab == 3) {
      this.sexChart();
    }
  },
  daysTab:function(e) {
    this.setData({
      activeDays: e.target.dataset.days
    })
    if (this.data.activeDays == 15) {
      this.setData({
        timeList: this.data.sevenTime,
        countList1: this.data.sevenNewCount,
        countList2: this.data.sevenOldCount
      })
    } else if (this.data.activeDays == 7) {
      this.setData({
        timeList: this.data.shiwuTime.slice(0, 8),
        countList1: this.data.shiwuNewCount.slice(0, 8),
        countList2: this.data.shiwuOldCount.slice(0, 8),
      })
    }
  }
})