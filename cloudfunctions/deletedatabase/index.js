const cloud = require('wx-server-sdk')

cloud.init()


// 云函数入口函数
exports.main = (event, context) => {
  const db = cloud.database()
  var _id=event.id
  db.collection('Register').doc(_id).remove()
}
