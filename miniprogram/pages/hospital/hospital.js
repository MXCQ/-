const app = getApp()



Page({

  data: {
    openid: '',
    information:{},
    hospitalId:'',
    hospitalName:'',
    office:[],
    doctor:[],
    curIndex: 0
  },

  onLoad(options){
    console.log('传参成功，',options.hospitalId)
    if (app.globalData.openid) {
      this.setData({
        hospitalId: options.hospitalId,
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
    db.collection('Hospital').where({
      _id: this.data.hospitalId
    }).get({
      success: res => {
        //console.log(res)
        this.setData({
          information: res.data[0],
          hospitalName:res.data[0].name
        })
        console.log('开始查科室在',this.data.hospitalName)
        db.collection('Office').where({
          hospital:this.data.hospitalName
        }).get({
          success: res => { 
            //console.log(res)
            this.setData({
              office: res.data
            })
            console.log(this.data.office)
          }
        })
        db.collection('Doctor').where({
          hospital: this.data.hospitalName
        }).get({
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
