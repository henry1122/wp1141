// 检查数据库密码配置
const fs = require('fs')
const path = require('path')

// 读取 .env.local 文件
const envFile = path.join(__dirname, '.env.local')
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8')
  const match = envContent.match(/DATABASE_URL=(.+)/)
  if (match) {
    const dbUrl = match[1].trim()
    console.log('📋 当前 DATABASE_URL 配置：')
    console.log(dbUrl)
    console.log('\n解析：')
    
    // 解析连接字符串
    const urlMatch = dbUrl.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@(.+)\/(.+)\?/)
    if (urlMatch) {
      const username = urlMatch[1]
      const passwordEncoded = urlMatch[2]
      const cluster = urlMatch[3]
      const database = urlMatch[4]
      
      // 解码密码
      const passwordDecoded = decodeURIComponent(passwordEncoded)
      
      console.log(`  用户名: ${username}`)
      console.log(`  密码（编码）: ${passwordEncoded}`)
      console.log(`  密码（原始）: ${passwordDecoded}`)
      console.log(`  集群: ${cluster}`)
      console.log(`  数据库: ${database}`)
      
      console.log('\n⚠️  如果认证失败，请确认：')
      console.log('1. MongoDB Atlas 中的实际密码是什么？')
      console.log('2. 密码中的特殊字符是否正确编码？')
      console.log('   - @ → %40')
      console.log('   - # → %23')
      console.log('   - $ → %24')
      console.log('   - % → %25')
      console.log('   - & → %26')
    }
  }
}

