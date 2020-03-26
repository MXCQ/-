//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    openid: "",
    user:[],
    todoListFetched: false,
    todoList: [],
    searchContent: '',
    newContent: '',
    filtered: false,
    loading: false,
    hospitalId1:"8021d443-1939-4f7a-a1d8-5ccd7cce959e",
    hospitalId2:"fc1b7a71-e588-4bbb-afa0-d0da1e127eed"
  },
  //事件处理函数
  bindViewTap: function() {
    
  },
  onLoad: function (options) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo
              })
              console.log(res.userInfo)
              this.globalData.userInfo=res.userInfo
            }
          })
        }else{
          console.log('未授权')
        }
      }
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openid:res.result.openid
        })
        this.addUser()
        wx.showToast({
          title: 'openid登录成功！',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          title: '获取openid失败！',
        })
      }
    })
  },

  addUser(){
    var flag=false
    const db = wx.cloud.database()
    db.collection('User').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        //console.log(this.data.openid, 'sdafasdfdsaf')
        console.log(res)
        this.setData({
          user: res.data
        })
        if(res.data.length) flag=true
        else flag=false
        if (flag)
          console.log("已有用户信息")
        else {
          wx.cloud.callFunction({
            name: 'adddatabase',
            //db.collection('User').add({
            data: {
              _openid: this.data.openid,
              flag: 1
            },
            success: res => { },
            fail: err => {
              console.log(err, '调用云函数失败')
            }

          })
          console.log("添加新用户信息")
        }   
      }
    })
    
  },
 
  //测试合并冲突
  onMakePhone: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.yebotel
    })
  }
})
