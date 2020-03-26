
var app = getApp();
Page({
  data: {
    registers:[],
    open:false,
    available:[],
    openid:'',
    date:{}
  },
onLoad(){
  if (app.globalData.openid) {
    this.setData({
      openid: app.globalData.openid
    })
    var myDate = new Date()
    this.setData({
      date:{
        'day': myDate.getDate(),
        'month': myDate.getMonth() + 1,
        'year': myDate.getFullYear()
      }
    })
    this.queryTodoList()
  } else {
    wx.showLoading({
      title: '正在初始化...'
    })
    app.getUserOpenIdViaCloud()
      .then(openid => {
        this.setData({
          openid
        })
        wx.hideLoading()
        this.queryTodoList()
        return openid
      }).catch(err => {
        console.error(err)
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '初始化失败，请检查网络'
        })
      })
  }
},
  queryTodoList() {
    const db = wx.cloud.database()
    //console.log(db)
    db.collection('Register').get({
      success: res => {
        console.log(res)
        this.setData({
          registers:res.data
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
cancel(e){
  var id = e.currentTarget.dataset.id
  const db = wx.cloud.database()
  wx.cloud.callFunction({
    name: 'deletedatabase',
    data: {
      id: id,
    },
    success: res => {
      wx.showToast({
        title: '取消成功',
      })
      this.onLoad()
    },
    fail: err => {
      icon: 'none',
        console.error('挂号[更新记录] 失败：', err)
    }
  })
},

  kindToggle(e) {
    if(this.data.open)
      this.setData({
        open:false
      })
    else 
      this.setData({
        open:true
      })
    wx.reportAnalytics('click_view_programmatically', {})
  }
})
