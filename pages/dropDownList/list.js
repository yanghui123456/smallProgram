// pages/dropDownList/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listArr:{
      type:Array,
      value: ''
    },
    innerText: {
      type: String,
      value: 'default value',
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    catalogSelect: '',//判断是否选中
  },
  onLoad: function () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTap: function (e) {
      console.log(e);
      var clickId = e.currentTarget.dataset.id;
      this.setData({
        catalogSelect: e.currentTarget.dataset.id
      })
      // 将id放进缓存中
      wx.setStorage({
        key: "catalogSelect",
        data: clickId
      })
      var myEventDetail = {e:e} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption);
    },
    // 关闭列表弹窗
    closeMask:function() {
      this.triggerEvent('hide');
    }
  }
})
