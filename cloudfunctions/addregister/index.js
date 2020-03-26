const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = (event, context) => {
  const db = cloud.database()
  db.collection('Register').add({
    // data 传入需要局部更新的数据
    data:{
      _openid:event.openid,
      date: event.date,
      time: event.time,
      doctorId: event.doctorId,
      doctor: event.doctor,
      hospital: event.hospital,
      office: event.office
    }
  })
}
