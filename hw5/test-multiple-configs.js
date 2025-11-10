// 测试多个配置
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

// 读取 .env.local
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

const configs = [
  {
    name: '当前配置（有数据库名）',
    url: 'mongodb+srv://hocashi:cjwericv@cluster0.suswhjg.mongodb.net/my-x?retryWrites=true&w=majority'
  },
  {
    name: '无数据库名',
    url: 'mongodb+srv://hocashi:cjwericv@cluster0.suswhjg.mongodb.net/?retryWrites=true&w=majority'
  },
  {
    name: '使用 appName',
    url: 'mongodb+srv://hocashi:cjwericv@cluster0.suswhjg.mongodb.net/my-x?appName=Cluster0&retryWrites=true&w=majority'
  }
]

async function testConfig(config) {
  console.log(`\n测试: ${config.name}`)
  console.log(`URL: ${config.url}`)
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.url
      }
    }
  })
  
  try {
    await prisma.$connect()
    console.log('✅ 连接成功！')
    
    // 尝试查询
    const userCount = await prisma.user.count()
    console.log(`✅ 查询成功！用户数: ${userCount}`)
    
    await prisma.$disconnect()
    return true
  } catch (error) {
    console.error(`❌ 失败: ${error.message}`)
    await prisma.$disconnect()
    return false
  }
}

async function testAll() {
  console.log('🔍 测试多个配置...\n')
  
  for (const config of configs) {
    const success = await testConfig(config)
    if (success) {
      console.log(`\n✅ 成功配置: ${config.name}`)
      console.log(`请使用: ${config.url}`)
      return config.url
    }
    // 等待一下再测试下一个
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n❌ 所有配置都失败了')
  console.log('请检查：')
  console.log('1. 密码是否正确（cjwericv）')
  console.log('2. 用户名是否正确（hocashi）')
  console.log('3. IP 白名单是否包含 0.0.0.0/0')
  console.log('4. 密码更新后是否等待了 2-3 分钟')
}

testAll()

