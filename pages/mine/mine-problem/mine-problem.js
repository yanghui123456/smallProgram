//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list1: false,
    list2:false,
    list3:false
  },
  //事件处理函数
  onLoad: function () {
  },
  tab:function(e) {
    if (e.target.dataset.type === '1') {
      if (this.data.list1 === true) {
        this.setData({
          list1: false
        })
      } else {
        this.setData({
          list1: true,
          list2: false,
          list3: false
        })
      }
     
    } else if (e.target.dataset.type === '2') {
      if (this.data.list2 === true) {
        this.setData({
          list2: false
        })
      } else {
        this.setData({
          list1: false,
          list2: true,
          list3: false
        })
      }
    } else if (e.target.dataset.type === '3') {
      if (this.data.list3 === true) {
        this.setData({
          list3: false
        })
      } else {
        this.setData({
          list1: false,
          list2: false,
          list3:true
        })
      }
    }
  }
})
