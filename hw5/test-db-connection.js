// 测试 MongoDB 连接
const fs = require('fs')
const path = require('path')

// 读取 .env.local 文件
const envFile = path.join(__dirname, '.env.local')
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  try {
    console.log('🔍 测试 MongoDB 连接...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '已设置' : '未设置')
    
    // 尝试连接
    await prisma.$connect()
    console.log('✅ 连接成功！')
    
    // 尝试查询
    const userCount = await prisma.user.count()
    console.log(`✅ 数据库查询成功！当前用户数: ${userCount}`)
    
  } catch (error) {
    console.error('❌ 连接失败：')
    console.error('错误类型:', error.constructor.name)
    console.error('错误信息:', error.message)
    
    if (error.message.includes('authentication failed')) {
      console.error('\n💡 可能的原因：')
      console.error('1. 密码不正确')
      console.error('2. 用户名不正确')
      console.error('3. 密码中的特殊字符需要 URL 编码')
      console.error('   - @ 应该编码为 %40')
      console.error('   - # 应该编码为 %23')
      console.error('   - $ 应该编码为 %24')
    } else if (error.message.includes('timeout') || error.message.includes('No available servers')) {
      console.error('\n💡 可能的原因：')
      console.error('1. IP 地址未在白名单中')
      console.error('2. 网络连接问题')
      console.error('3. MongoDB Atlas 集群未启动')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()

