//index.js
//获取应用实例
const app = getApp()

Page({
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    this.setData({
      page: 1,
      tjList:[],
    })
    this.httpTjList();
  },
  onReachBottom:function() {
    // 上拉加载-判断是否已经加载完所有的数据
    if (this.data.loadAll == true) {
      wx.showToast({
        title: '暂无更多数据',
        icon:'none',
        duration:2000
      })
    } else {
      this.setData({
        page: this.data.page + 1
      })
      this.httpTjList();
    }
  },
  data: {
    touchMove:0,
    top: ' ',
    left: ' ',
    windowWidth: '',
    windowHeight: '',
    defaultTab:1,
    tabId:'tab1',
    tabList:[], //tab栏数组
    showBuy:false,
    showShareStep:false,
    showZfgl:false,
    imgList: [],
    page:1,
    pageSize:9,
    tjList:[], //推荐列表
    buyToastText:'',
    buyToastType:'',
    buyToastImg:'',
    htb:'',
    buyTemplateId:'', //每条信息的模板id
    templateTypeId:1,
    pyqImgList:'',//朋友圈多张图片
    loadAll: false, //是否加载完所有的数据
    buySuccess:false
  },
  //事件处理函数
  onLoad: function () {
    this.httpTabs(); //tab
    this.httpTjList(); //内容
    this.httpHtb(); //海豚币
  },
  onShow: function () {
  },
  // 海豚币
  httpHtb:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/gift/api/v1.0.0/select/dolphincoin/count',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            htb: data.data
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.httpHtb());
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
  // 切换tab栏
  httpTabs:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/select/friendcircle/type',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data: '',
      success: function (res) {
        if (res.data.businessCode === '0000') {
          that.setData({
            tabList:res.data.data.content
          })
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(thats.httpTabs());
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
  tjListAll:function() {
    this.setData({
      page:'',
      pageSize:'',
      tjList:[]
    })
    this.httpTjList();
  },
  // 保存次数
  httpSaveCount:function() {
    var that = this;
    var params = {
      templateId: that.data.buyTemplateId
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/download/friendcircle/picture',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data: params,
      success: function (res) {
        if (res.data.businessCode === '0000') {
          that.httpSaveTjList();//刷新当前tab列表
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
  // 保存成功后再次获取不给弹窗 和httpTjList一样
  httpSaveTjList: function () {
    var that = this;
    if (that.data.loadAll == true) { //如果已经加载完毕所有的数据后，点击保存刷新后加载所有的数据
      that.setData({
        page: '',
        pageSize: ''
      })
    }
    var params = {
      templateTypeId: that.data.templateTypeId,
      brokerId: app.globalData.agentInfo.id,
      page: that.data.page,
      pageSize: that.data.pageSize
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/select/friendcircle/template',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data: params,
      success: function (res) {
        if (res.data.businessCode === '0000') {
          // 判断是否有数据
          if (res.data.data == null) {
            var a = [];
            var old = that.data.tjList;//旧数据
            for (var i = 0; i < a.length; i++) {
              old.push(a[i]);
            }
            that.setData({
              tjList: old,
              loadAll:true
            })
          } else {
            if (that.data.pageSize == '') { //推荐查看全部
              that.setData({
                tjList: res.data.data,
                loadAll:false
              })
            } else {
              that.setData({
                tjList: res.data.data,
                loadAll:false
              })
            }
          }
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(thats.httpSaveTjList());
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
  httpTjList:function() {
    wx.showLoading({
      title: '正在加载中',
    })
    var that = this;
    var params = {
      templateTypeId: that.data.templateTypeId,
      brokerId: app.globalData.agentInfo.id,
      page:that.data.page,
      pageSize:that.data.pageSize
    };
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/select/friendcircle/template',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      data: params,
      success: function (res) {
        if (res.data.businessCode === '0000') {
          // 无数据时
          if (res.data.data == null) {
            console.log('已经加载完毕所有的');
            wx.showToast({
              title: '暂无更多数据',
              icon:'none',
              duration:2000
            })
            that.setData({
              loadAll: true
            })
          } else {
            // 有数据
            if (that.data.pageSize == '') { //推荐查看全部
            console.log('查看全部')
              that.setData({
                tjList: res.data.data,
                loadAll:true
              })
            } else { //查看部分
              that.setData({
                loadAll: false
              })
              console.log('不是查看全部');
              if (that.data.buySuccess == true) { //购买成功
                that.setData({
                  tjList: res.data.data,
                  buySuccess:false
                })
              } else {
                // 往原始数据中追加数据
                var a = res.data.data;//后台返回的数据
                var old = that.data.tjList;//旧数据
                for (var i = 0; i < a.length; i++) {
                  old.push(a[i]);
                }
                that.setData({
                  tjList: old
                })
              }
            }
          }
          wx.hideLoading();
          wx.stopPullDownRefresh();
        } else if (res.data.businessCode === '0009') {
          app.getSessionKey(thats.httpTjList());
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
  ontabClick:function(e) {
    console.log(e);
    this.setData({
      defaultTab:e.target.dataset.item,
      tabId: e.target.dataset.id,
      showBuy: false,
      templateTypeId:e.target.dataset.item,
      page:1,
      pageSize:9,
      tjList: [] //点击tab栏时清空数组
    })
    this.httpTjList();
  },
  buyItem:function(e) {
    // 推进列表使用的
    app.globalData.pyqImgUrl = e.target.dataset.img[0]; //一张图片后台也返回数组默认只有一个
    app.globalData.pyqText = e.target.dataset.text;
    app.globalData.pyqType = e.target.dataset.type;
    app.globalData.pyqTemplateId = e.target.dataset.id;
    if (e.target.dataset.type !== '已购买' && e.target.dataset.type !== '免费') {
      this.setData({
        showBuy: !this.data.showBuy,
        buyToastText: e.target.dataset.text,
        buyToastType: e.target.dataset.type,
        buyToastImg: e.target.dataset.img,
        buyTemplateId: e.target.dataset.id
      })
    } else {
      // 免费或已购买的
      wx.navigateTo({
        url: '../../pyq/buy-success/buy-success'
      })
    }
  },
  hideBuyItem:function() {
    this.setData({
      showBuy: !this.data.showBuy
    })
  },
  setTouchMove: function (e) {
    console.log('触摸开始');
    console.log(e);
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        })
        console.log(that.data.windowWidth);
        console.log(that.data.windowHeight);
      }
    })
    // 让该页面禁止滑动
      console.log("横坐标" + e.touches[0].clientX)
      console.log("纵坐标" + e.touches[0].clientY)
      if ((e.touches[0].clientX < 650) && e.touches[0].clientY < 1110 && e.touches[0].clientX > 0 && e.touches[0].clientY > 0) {
        that.setData({
        left: e.touches[0].clientX - 30,
        top: e.touches[0].clientY - 30
    })
    } else if (e.touches[0].clientX <= 0 && e.touches[0].clientY <=30) {
    // 超出左上角的
        that.setData({
          left: 0,
          top: 30
      })
      } else if (e.touches[0].clientX >= that.data.windowWidth - 60 && e.touches[0].clientY <= 30) {
        // 超出右上角的
        that.setData({
          left: that.data.windowWidth - 60,
          top: 30
        })
      } else if (e.touches[0].clientX >= that.data.windowWidth - 60) {
        // 右边超出宽度
        that.setData({
          left: that.data.windowWidth - 60,
          top: e.touches[0].clientY
        })
      }
},
  moveEnd:function() {
    console.log('触摸结束');
  },
  // 购买
  buy:function(e) {
    // 判断海豚币是否充足
    var that = this;
    // 去掉海豚币后边的币字符
    if (Number(that.data.htb) < Number(that.data.buyToastType.substring(0, that.data.buyToastType.length - 1))) {
        wx.showToast({
          title: '海豚币不足',
          icon:'none',
          duration:2000
        })
        return
    } else {
      wx.showModal({
        title: '提示',
        content: '是否确认购买？',
        success: function (res) {
          if (res.confirm) {
            // 调购买接口成功后跳转页面
            that.setData({
              buySuccess: true
            })
            wx.showLoading({
              title: '正在购买',
            })
            that.buyImg();
          } else if (res.cancel) {
            console.log('用户点击取消')
            wx.showToast({
              title: '取消购买',
              icon: 'none',
              duration: 2000
            })
            that.setData({
              buySuccess: false
            })
          }
        }
      })
    }
  },
  // 确认购买
  buyImg:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/buy/friendcircle/picture',
      method: 'POST',
      data: {
        brokerId: app.globalData.agentInfo.id,
        templateId: that.data.buyTemplateId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 购买付费的图片时，如果loadAll为true，代表已经加载所有的推荐列表，此时需要加载列表的全部内容
          if (that.data.loadAll == true) {
           that.setData({
             page: '',
             pageSize: ''
           })
          }
          that.httpTjList();//购买成功刷新推荐列表和海豚币
          that.httpHtb();
          that.setData({
            showBuy:false
          })
          wx.navigateTo({
            url: '../../pyq/buy-success/buy-success'
          })
          wx.hideLoading();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.buyImg());
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
  recharge:function(e) {
    app.goNewPage(e);
  },
// 增员攻略
  zyglShare:function(e) {
    // 查看授权
    console.log(e);
    var that = this;
    that.setData({
      buyToastText: e.target.dataset.text,
      pyqImgList: e.target.dataset.imglist, //除了推荐tab的图片数组
      buyTemplateId:e.target.dataset.id
    })
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
  saveImg: function () {
    var that = this;
    var empty = [];
    wx.showLoading({
      title: '图片正在保存中',
    });

    if (that.data.templateTypeId !== 1) { //除了推荐tab
      // that.setData({
      //   imgList: this.data.pyqImgList 
      // })
      // 复制内容
      wx.setClipboardData({
        data: that.data.buyToastText,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              console.log(res);
            }
          })
        }
      })
      console.log(that.data.pyqImgList);
      for (var i = 0; i < that.data.pyqImgList.length; i++) {
        wx.downloadFile({
          url: that.data.pyqImgList[i],
          success: function (res) {
            console.log(res);
            var lastUrl = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: lastUrl,
              success(res) {
                console.log('保存图片成功');
                empty.push(lastUrl);
                // 多张图片保存，保存成功一张empty中增加一项，该数组长度和imgLit长度相等时说明全部图片保存完毕，
                if (empty.length == that.data.pyqImgList.length) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '图片保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.checkZygl();
                  that.httpSaveCount();//保存成功增加转发次数
                }
              },
              fail(res) {
                console.log('保存图片失败')
                wx.hideLoading();
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
              icon:'none',
              duration:2000
            })
          }
        })
      }
    } else {
      console.log(that.data.imgList);
      for (var i = 0; i < that.data.imgList.length; i++) {
        wx.downloadFile({
          url: that.data.imgList[i],
          success: function (res) {
            var lastUrl = res.tempFilePath;
            wx.saveImageToPhotosAlbum({
              filePath: lastUrl,
              success(res) {
                console.log('保存成功');
                empty.push(lastUrl);
                // 多张图片保存，保存成功一张empty中增加一项，该数组长度和imgLit长度相等时说明全部图片保存完毕，
                if (empty.length == that.data.imgList.length) {
                  wx.hideLoading();
                  wx.showToast({
                    title: '图片保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                  that.checkZygl();
                  that.httpSaveCount();//保存成功增加转发次数
                }
              },
              fail(res) {
                console.log('保存图片失败')
                wx.hideLoading();
                wx.showToast({
                  title: '图片保存失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            })
          },
          fail: function (res) {
            console.log(res);
            wx.hideLoading();
            wx.showToast({
              title: '下载失败',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }
  },
  zyglHowShare:function() {
    this.setData({
      showShareStep: !this.data.showShareStep
    })
  },
  checkZygl:function() {
    this.setData({
      showZfgl: !this.data.showZfgl
    })
  }
})
