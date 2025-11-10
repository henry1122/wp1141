// MongoDB 连接诊断工具
const { MongoClient } = require('mongodb')

const url = 'mongodb+srv://hocashi:P%40qq3849cjwericv@cluster0.suswhjg.mongodb.net/my-x?retryWrites=true&w=majority'

async function diagnose() {
  console.log('🔍 MongoDB 连接诊断...\n')
  
  console.log('连接字符串解析:')
  const match = url.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]+)/)
  if (match) {
    console.log(`  用户名: ${match[1]}`)
    console.log(`  密码编码: ${match[2]}`)
    console.log(`  密码原始: ${decodeURIComponent(match[2])}`)
    console.log(`  集群: ${match[3]}`)
    console.log(`  数据库: ${match[4]}`)
  }
  
  console.log('\n尝试连接...')
  const client = new MongoClient(url)
  
  try {
    await client.connect()
    console.log('✅ 连接成功！')
    
    // 尝试列出数据库
    const adminDb = client.db().admin()
    const dbs = await adminDb.listDatabases()
    console.log('\n可用的数据库:')
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`)
    })
    
    // 尝试访问 my-x 数据库
    const db = client.db('my-x')
    const collections = await db.listCollections().toArray()
    console.log('\nmy-x 数据库中的集合:')
    collections.forEach(col => {
      console.log(`  - ${col.name}`)
    })
    
    // 尝试查询 users 集合
    if (collections.some(c => c.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments()
      console.log(`\n✅ users 集合中有 ${usersCount} 个文档`)
    }
    
    await client.close()
    console.log('\n✅ 诊断完成：连接和查询都正常！')
    
  } catch (error) {
    console.error('\n❌ 连接失败:')
    console.error(`  错误类型: ${error.constructor.name}`)
    console.error(`  错误信息: ${error.message}`)
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 认证失败的可能原因:')
      console.error('1. 密码不正确 - 请确认 MongoDB Atlas 中的实际密码')
      console.error('2. 用户名不正确 - 请确认用户名是 "hocashi"')
      console.error('3. 用户权限不足 - 请确认用户有读写权限')
      console.error('4. 数据库名称错误 - 当前使用 "my-x"，请确认是否正确')
    } else if (error.message.includes('timeout') || error.message.includes('No available servers')) {
      console.error('\n💡 连接超时的可能原因:')
      console.error('1. IP 地址未在白名单中 - 请添加 0.0.0.0/0')
      console.error('2. 网络连接问题')
      console.error('3. MongoDB Atlas 集群未启动')
    }
    
    process.exit(1)
  }
}

diagnose()

