const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = (event, context) => {
  const db = cloud.database()
  db.collection('User').add({
    // data 传入需要局部更新的数据
    data:{
      _openid:event._openid,
      flag: event.flag
    }
  })
}
