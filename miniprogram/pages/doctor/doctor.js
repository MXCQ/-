const app = getApp()



Page({

  data: {
    openid: '',
    doctorId:'',
    information:{},
    cur_week:'',
    dayList: [],
    availtime_am: [],
    availtime_pm: [],
    flag_am: [0,0,0,0,0,0,0],
    flag_pm: [0,0,0,0,0,0,0]
  },

  onLoad(options){
    console.log('传参成功，',options.doctorId)
    
    if (app.globalData.openid) {
      this.setData({
        doctorId: options.doctorId,
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

    var myDate = new Date()
    myDate.toLocaleDateString()
    var month = myDate.getMonth() + 1
    var time = myDate.getFullYear() + '年' + month + '月' + myDate.getDate() + '日'

    var total = 1;// 个数
    var dayList = []
    dayList.push({
      'day': myDate.getDate(),
      'month': myDate.getMonth() + total,
      'week': this.toWeekDay(myDate.getDay()),
      'year': myDate.getFullYear()
    });
    for (var i = 0; i < 6; i++) {
      myDate.setDate(myDate.getDate() + total) // number 是最近几天  则会自动计算
      // 需求  月份-日   星期几
      dayList.push({
        'day': myDate.getDate(),
        'month': myDate.getMonth() + total,
        'week': this.toWeekDay(myDate.getDay()),
        'year': myDate.getFullYear()
      });
    }
    //用于处理的页面的数据布置
    this.setData({
      dayList: dayList,
      cur_week: myDate.getDay() == 0 ? 7 : myDate.getDay()
    })
    
    const db=wx.cloud.database()
    db.collection('Register').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0;j<this.data.dayList.length;j++) {
            console.log(res.data.length)
            console.log(res.data[i])
            console.log(this.data.dayList[j])
            if (isObjEqual(res.data[i].date,this.data.dayList[j]))
            {
              console.log('xuqiu2')
              if(res.data[i].time=="am")
              {
                let availtime = this.data.flag_am
                availtime[j] = 1
                this.setData({
                  flag_am:availtime
                })
              }else{
                let availtime = this.data.flag_pm
                availtime[j] = 1
                this.setData({
                  flag_pm: availtime
                })
              }
              break;
            }
          }
        }
      }
    })
  },

  isObjEqual(o1, o2){
    var props1 = Object.getOwnPropertyNames(o1);
    var props2 = Object.getOwnPropertyNames(o2);
    if(props1.length != props2.length) {
      return false;
    }
    for (var i = 0, max = props1.length; i < max; i++) {
      var propName = props1[i];
      if (o1[propName] !== o2[propName]) {
        return false;
      }
    }
    return true;
  },

  onquery(){
    const db = wx.cloud.database()
    console.log('开始查询数据库',db)
    console.log(this.data.doctorId)
    db.collection('Doctor').where({
      _id: this.data.doctorId
    }).get({
      success: res => {
        console.log(res)
        this.setData({
          information: res.data[0],
          availtime_am: res.data[0].availabletime.am,
          availtime_pm: res.data[0].availabletime.pm
        })
        console.log(information)
      },
      fail: err => {
        wx.showToast({
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    
    console.log('结束查询数据库')
  },

  toWeekDay(weekDay) {// 传入数据  讲一周的某一天返回成中文状态下的字符
    switch (weekDay) {
      case 1: return '一'; break;
      case 2: return '二'; break;
      case 3: return '三'; break;
      case 4: return '四'; break;
      case 5: return '五'; break;
      case 6: return '六'; break;
      case 0: return '日'; break;
      default: break;
    }
    return '传入未知参数';
  },

  register_am(e){
    var index = e.currentTarget.dataset.index
    const db = wx.cloud.database()
    var newam= "availtime_am["+index+"]"
    this.setData({
      [newam]:this.data.availtime_am[index]-1
    })
    var newavail="information.availabletime.am"
    this.setData({
      [newavail]: this.data.availtime_am
    })
    wx.cloud.callFunction({
      name:'updatedatabase',
      data:{
        doctorId:this.data.doctorId,
        availabletime: this.data.information.availabletime 
      },
      success: res => {
        wx.showToast({
          title: '挂号成功',
        })
        wx.cloud.callFunction({
          name:'addregister',
          data:{
            openid:this.data.openid,
            date: this.data.dayList[index],
            time: 'am',
            doctorId: this.data.doctorId,
            doctor:this.data.information.name,
            hospital: this.data.information.hospital,
            office: this.data.information.office
          },
          success:res=>{
            console.log('建立挂号记录成功')
          }
        })
      },
      fail: err => {
        icon: 'none',
        console.error('挂号[更新记录] 失败：', err)
      }
    })
  },

  register_pm(e) {
    var index = e.currentTarget.dataset.index
    const db = wx.cloud.database()
    var newam = "availtime_pm[" + index + "]"
    this.setData({
      [newam]: this.data.availtime_pm[index] -1
    })
    var newavail = "information.availabletime.pm"
    this.setData({
      [newavail]: this.data.availtime_pm
    })

    wx.cloud.callFunction({
      name: 'updatedatabase',
      data: {
        doctorId: this.data.doctorId,
        availabletime: this.data.information.availabletime
      },
      success: res => {
        wx.showToast({
          title: '挂号成功',
        })
        wx.cloud.callFunction({
          name: 'addregister',
          data: {
            openid: this.data.openid,
            date: this.data.dayList[index],
            time: 'pm',
            doctorId: this.data.doctorId,
            doctor: this.data.information.name,
            hospital: this.data.information.hospital,
            office: this.data.information.office
          },
          success: res => {
            console.log('建立挂号记录成功')
          }
        })
      },
      fail: err => {
        icon: 'none',
          console.error('挂号[更新记录] 失败：', err)
      }
    })
  }
  

})
