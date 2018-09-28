//获取应用实例
const app = getApp()
Page({
  onPullDownRefresh: function () {
    this.httpTeam();
  },
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.brokerName + '的团队邀请函',
      path: '/pages/team/3-team-invitation/3-team-invitation?brokerTeamId=' + this.data.brokerTeamId + '&serverIp=' + app.globalData.severIp + '&brokerName=' + this.data.brokerName,
      imageUrl: 'http://oss.baoxian.xujinkeji.com/broker/send-no-red.jpg',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
        that.setData({
          showAddMask:false
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  httpTeam:function() {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/select/my/broker/team',
      method: 'POST',
      data: {},
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') { // 有团队
          app.globalData.teamData = data.data; // 开始存储有团队的团队数据
          that.onLoad();
        } else if (data.businessCode === '0002') { // 没有团队
          wx.navigateTo({
            url: '../../mine/mine-team-no/mine-team-no',
          })
        } else if (data.businessCode === '0003') { // 支付中（从团队版开通流程到支付界面未支付，直接退出小程序）
          wx.navigateTo({
            url: '../../mine/buy-author/buy-author',
          })
        } else if (data.businessCode === '0004') { // 申请加入的团队管理员未审核
          wx.showToast({
            title: '您的申请管理员正在审核中',
          })
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.goTeam());
        } else {
          wx.showToast({
            title: data.msg,
            icon: 'none',
            duration: 2000
          })
          return;
        }
        wx.stopPullDownRefresh();
      }
    })
  },
  data: {
    sort:false, // false(从高到低，默认), true(从低到高)
    showAddMask:false,
    showSetting:false,
    showTips:false,
    teamRole:'',//团队角色：管理员、成员
    expireDate:'', // 授权到期时间
    authMember:'',// 加入团队成员个数
    totalMember:'',// 团队总授权个数
    headUrls: '', // 头像列表
    brokerTeamListModels:'',// 成员列表
    teamData: {},// 数据
    brokerTeamId:'',
    brokerName:'',
    brokerImg:'',
    img1:false,
    img2:false,
    img3:false,
    img4:false,
    img5:false,
    imgUrl1:'',
    imgUrl2:'',
    imgUrl3:'',
    imgUrl4:'',
    imgUrl5:'',
    ranks:''
  },
  onLoad: function (options) {
    console.log(app.globalData.teamData);
    this.setData({
      teamData: app.globalData.teamData,
      teamRole: app.globalData.teamData.teamRole,
      expireDate: app.globalData.teamData.expireDate,
      authMember: app.globalData.teamData.authMember,
      totalMember: app.globalData.teamData.totalMember,
      headUrls: app.globalData.teamData.headUrls,
      brokerTeamListModels: app.globalData.teamData.brokerTeamListModels,
      brokerName: app.globalData.agentInfo.realName,
      brokerImg: app.globalData.agentInfo.headUrl,
      ranks: app.globalData.teamData.rank,
      brokerTeamId: app.globalData.teamData.brokerTeamId
    })
    // 设置授权成员头像的地址和显示
    if (this.data.headUrls.length == 0) {
      this.imgShow(false,false,false,false,false,'','','','','')
    } else if (this.data.headUrls.length == 1) {
      this.imgShow(true, false, false, false, false, this.data.headUrls[0], '', '', '', '')
    } else if (this.data.headUrls.length == 2) {
      this.imgShow(true, true, false, false, false, this.data.headUrls[0], this.data.headUrls[1], '', '', '')
    } else if (this.data.headUrls.length == 3) {
      this.imgShow(true, true, true, false, false, this.data.headUrls[0], this.data.headUrls[1], this.data.headUrls[2], '', '')
    } else if (this.data.headUrls.length == 4) {
      this.imgShow(true, true, true, true, false, this.data.headUrls[0], this.data.headUrls[1], this.data.headUrls[2], this.data.headUrls[3], '')
    } else if (this.data.headUrls.length == 5) {
      this.imgShow(true, true, true, true, true, this.data.headUrls[0], this.data.headUrls[1], this.data.headUrls[2], this.data.headUrls[3], this.data.headUrls[4])
    }
  },
  // 设置头像列表的地址和显示
  imgShow:function(a,b,c,d,e,f,g,h,i,j) {
    this.setData({
      img1: a,
      img2: b,
      img3: c,
      img4: d,
      img5: e,
      imgUrl1: f,
      imgUrl2: g,
      imgUrl3: h,
      imgUrl4: i,
      imgUrl5: j
    })
  },
  buyAuthor:function() {
    wx.navigateTo({
      url: '../buy-author/buy-author?back=2',
    })
  },
  detail:function() {
    wx.navigateTo({
      url: '../team-detail/team-detail',
    })
  },
  call:function(e) {
    console.log(e);
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel
    })
  },
  invitMember:function() {
    // 判断已授权人数是否小于可授权总人数
    if (this.data.authMember == this.data.totalMember) {
      wx.showToast({
        title: '团队已满员，购买授权后即可继续邀请',
        icon:'none',
        duration:2000
      })
    } else {
      this.setData({
        showAddMask: !this.data.showAddMask
      })
    }
  },
  manageSetting:function(){
    this.setData({
      showSetting: !this.data.showSetting
    })
  },
  teamChartData:function() {
    console.log(1);
    wx.navigateTo({
      url: '../team-data/team-data',
    })
  },
  // 管理员审核：拒绝（1），通过（0)
  shenhe:function(e) {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    var types = e.target.dataset.type;
    var brokerid = e.target.dataset.brokerid;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/select/broker/team/auditor',
      method: 'POST',
      data: {
        brokerId: brokerid,
        type: types
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          if (types == 0) {
            wx.hideLoading();
            wx.showToast({
              title: '审核通过',
              icon: 'success',
              duration: 2000
            })
          } else if (types == 1) {
            wx.showToast({
              title: '审核拒绝',
              icon: 'none',
              duration: 2000
            })
          }
          that.getTeamData();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.shenhe());
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
  // 管理员审核后重新获取团队数据
  getTeamData: function () {
    var that = this;
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/select/my/broker/team',
      method: 'POST',
      data: {},
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          app.globalData.teamData = data.data; // 开始存储有团队的团队数据
          that.onLoad();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.getTeamData());
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
  brokerUserDetail:function(e) {
    var that = this;
    var brokerId = e.target.dataset.id;
    app.globalData.managerRoleBrokerData.bd = e.target.dataset.bd;
    app.globalData.managerRoleBrokerData.cd = e.target.dataset.cd;
    app.globalData.managerRoleBrokerData.id = e.target.dataset.id;
    app.globalData.managerRoleBrokerData.img = e.target.dataset.img;
    app.globalData.managerRoleBrokerData.kh = e.target.dataset.kh;
    app.globalData.managerRoleBrokerData.name = e.target.dataset.name;
    app.globalData.managerRoleBrokerData.tel = e.target.dataset.tel;
    // 客户维护列表
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/api/v1.0.0/customerList/query/' + brokerId,
      method: 'get',
      header: { 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          // 判断该经纪人下的客户维护列表是否为空
          if (data.data.customerList.length === 0) {
            app.globalData.managerRoleData = '';
            wx.navigateTo({
              url: '../team-detail/team-detail',
            })
          } else {
            app.globalData.managerRoleData = data.data.customerList
            wx.navigateTo({
              url: '../team-detail/team-detail',
            })
          }
        } else if (data.businessCode === '0009') {
          // sessionKey过期，重新获取
          app.getSessionKey(that.brokerUserDetail());
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
  sortChuda:function(e) {
    // 0触达度从高到低   1触达度从低到高
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    var sort = e.target.dataset.sotr
    wx.request({
      url: app.globalData.severIp + '/insurance/broker/team/api/v2.0.0/broker/list/sort',
      method: 'POST',
      data: {
        sort:sort
      },
      header: { 'content-type': 'application/x-www-form-urlencoded', 'openid': app.globalData.openId },
      success: function (res) {
        var data = res.data;
        if (data.businessCode === '0000') {
          that.setData({
            sort: !that.data.sort,
            brokerTeamListModels:data.data
          })
          wx.hideLoading();
        } else if (data.businessCode === '0009') {
          app.getSessionKey(that.sortChuda());
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
  // 管理员邀请
  managerInvit:function() {
    wx.navigateTo({
      url: '../../team/3-team-invitation/3-team-invitation?brokerTeamId=' + this.data.brokerTeamId + '&serverIp=' + app.globalData.severIp + '&brokerName=' + this.data.brokerName,
    })
  }
})