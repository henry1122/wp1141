// 检查 OAuth 配置的脚本
const fs = require('fs');
const path = require('path');

console.log('🔍 检查 OAuth 配置...\n');

// 检查 .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });
  
  console.log('✅ .env.local 文件存在\n');
  console.log('📋 环境变量检查:');
  console.log('─'.repeat(50));
  
  const requiredVars = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GITHUB_ID',
    'GITHUB_SECRET',
    'DATABASE_URL',
  ];
  
  requiredVars.forEach(varName => {
    if (envVars[varName]) {
      if (varName.includes('SECRET') || varName.includes('SECRET')) {
        console.log(`✅ ${varName}: 已设置 (${envVars[varName].substring(0, 10)}...)`);
      } else if (varName === 'DATABASE_URL') {
        const masked = envVars[varName].replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
        console.log(`✅ ${varName}: 已设置 (${masked.substring(0, 50)}...)`);
      } else {
        console.log(`✅ ${varName}: ${envVars[varName]}`);
      }
    } else {
      console.log(`❌ ${varName}: 未设置`);
    }
  });
  
  console.log('\n');
  
  // 检查 GitHub OAuth 配置
  console.log('🔐 GitHub OAuth 配置检查:');
  console.log('─'.repeat(50));
  if (envVars.GITHUB_ID && envVars.GITHUB_SECRET) {
    console.log(`✅ GitHub Client ID: ${envVars.GITHUB_ID}`);
    console.log(`✅ GitHub Client Secret: 已设置`);
    console.log('\n⚠️  请确认 GitHub OAuth App 设置:');
    console.log('   1. 访问: https://github.com/settings/developers');
    console.log('   2. 找到您的 OAuth App');
    console.log('   3. 确认 Authorization callback URL 设置为:');
    console.log(`      http://localhost:3000/api/auth/callback/github`);
    console.log('   4. 必须完全匹配，包括协议、域名、端口和路径');
  } else {
    console.log('❌ GitHub OAuth 凭据未设置');
  }
  
  console.log('\n');
  
  // 检查 NextAuth 配置
  console.log('🔧 NextAuth 配置检查:');
  console.log('─'.repeat(50));
  if (envVars.NEXTAUTH_URL) {
    console.log(`✅ NEXTAUTH_URL: ${envVars.NEXTAUTH_URL}`);
    if (envVars.NEXTAUTH_URL !== 'http://localhost:3000') {
      console.log('⚠️  警告: NEXTAUTH_URL 应该是 http://localhost:3000 (本地开发)');
    }
  } else {
    console.log('❌ NEXTAUTH_URL: 未设置');
  }
  
  if (envVars.NEXTAUTH_SECRET) {
    console.log(`✅ NEXTAUTH_SECRET: 已设置`);
  } else {
    console.log('❌ NEXTAUTH_SECRET: 未设置');
  }
  
} else {
  console.log('❌ .env.local 文件不存在');
  console.log('   请创建 .env.local 文件并添加必要的环境变量');
}

console.log('\n' + '='.repeat(50));
console.log('📝 下一步:');
console.log('   1. 确认 GitHub OAuth App 的 Callback URL 配置正确');
console.log('   2. 重启开发服务器: npm run dev');
console.log('   3. 清除浏览器缓存和 cookies');
console.log('   4. 重新测试 GitHub 登录');
console.log('='.repeat(50));

