
const app = getApp()

Page({
  data: {
    openid: '',
    todoListFetched: false,
    todoList: [],
    searchContent: '',
    newContent: '',
    filtered: false,
    loading: false
  },

  onLoad() {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      //console.log('加载成功，查询数据。')
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
    db.collection('Doctor').get({
      success: res => {
        this.setData({
          todoListFetched: true,
          todoList: res.data,
          filtered: false
        })
        console.log('[数据库] [查询记录] 成功: ', todoList)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
      //complete: () => {
      //  wx.hideLoading()
      //}
    })
  },

  onAdd() {
    const db = wx.cloud.database()
    db.collection('counters').add({
      data: {
        count: 1
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '新增记录成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  kindToggle(e) {
    const id = e.currentTarget.id
    const list = this.data.list
    for (let i = 0, len = list.length; i < len; ++i) {
      if (list[i].id === id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list
    })
    wx.reportAnalytics('click_view_programmatically', {})
  }
})
