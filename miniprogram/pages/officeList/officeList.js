const app = getApp()



Page({

  data: {
    openid: '',
    information:{},
    hospitalName:'',
    office:["内科","外科","耳鼻喉科","儿科"],
    doctor:[],
    curIndex: 0
  },

  onLoad(options){
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
      //console.log(this.data.doctorId)
      this.onquery()
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
          this.onquery()
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
  switchRightTab(e) {
    // 获取item项的id，和数组的下标值  
    let index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curIndex: index
    })
  },
  onquery(){
    const db = wx.cloud.database()
    //console.log('开始查询数据库',db)
    //console.log(this.data.hospitalId)
    db.collection('Doctor').get({
      success: res => {
        //console.log(res)
        this.setData({
          doctor: res.data
        })
      },
      fail: err => {
        wx.showToast({
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })    
    console.log('结束查询数据库')
  }
  

})
