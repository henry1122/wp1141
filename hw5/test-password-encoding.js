// 测试密码编码
const password = 'P@qq3849cjwericv'

// 方法1: 使用 encodeURIComponent
const encoded1 = encodeURIComponent(password)
console.log('方法1 (encodeURIComponent):')
console.log(`  原始: ${password}`)
console.log(`  编码: ${encoded1}`)

// 方法2: 手动替换
const encoded2 = password.replace('@', '%40')
console.log('\n方法2 (手动替换 @):')
console.log(`  原始: ${password}`)
console.log(`  编码: ${encoded2}`)

// 检查当前配置
const currentUrl = 'mongodb+srv://hocashi:P%40qq3849cjwericv@cluster0.suswhjg.mongodb.net/my-x?retryWrites=true&w=majority'
const match = currentUrl.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/)
if (match) {
  const encodedPassword = match[2]
  const decodedPassword = decodeURIComponent(encodedPassword)
  console.log('\n当前配置:')
  console.log(`  编码密码: ${encodedPassword}`)
  console.log(`  解码密码: ${decodedPassword}`)
  console.log(`  匹配原始密码: ${decodedPassword === password ? '✅ 是' : '❌ 否'}`)
}

// 测试不同的编码方式
console.log('\n测试不同的编码:')
console.log(`  encodeURIComponent: ${encodeURIComponent(password)}`)
console.log(`  手动替换 @: ${password.replace('@', '%40')}`)
console.log(`  手动替换所有特殊字符: ${password.replace(/[@#\$%&+\=?]/g, (m) => {
  const map = {'@': '%40', '#': '%23', '$': '%24', '%': '%25', '&': '%26', '+': '%2B', '=': '%3D', '?': '%3F'}
  return map[m] || m
})}`)

