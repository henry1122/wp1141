# 修复 MongoDB 认证错误

## 🔴 当前问题

虽然测试脚本显示连接成功，但 NextAuth 在运行时仍然出现认证失败错误：
```
SCRAM failure: bad auth : authentication failed
```

## 🔍 原因分析

1. **Next.js 开发服务器需要重启**：环境变量只在服务器启动时加载
2. **Prisma Client 缓存**：可能使用了旧的连接配置

## ✅ 解决方法

### 步骤 1: 停止开发服务器

在运行 `npm run dev` 的终端中：
- 按 `Ctrl+C` 停止服务器

### 步骤 2: 确认环境变量

检查 `.env.local` 文件中的 `DATABASE_URL`：
```env
DATABASE_URL=mongodb+srv://hocashi:cjwericv@cluster0.suswhjg.mongodb.net/my-x?appName=Cluster0&retryWrites=true&w=majority
```

### 步骤 3: 重新生成 Prisma Client

```bash
npx prisma generate
```

### 步骤 4: 重新启动开发服务器

```bash
npm run dev
```

## 🔧 如果问题仍然存在

### 方法 1: 清除 Next.js 缓存

```bash
rm -rf .next
npm run dev
```

### 方法 2: 检查环境变量是否正确加载

在 `lib/prisma.ts` 中添加调试日志（临时）：

```typescript
if (typeof window === 'undefined') {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '已设置' : '未设置')
  console.log('DATABASE_URL 前20字符:', process.env.DATABASE_URL?.substring(0, 20))
}
```

### 方法 3: 确认 MongoDB Atlas 设置

1. **用户权限**：确认用户 `hocashi` 有 "Read and write to any database" 权限
2. **IP 白名单**：确认包含 `0.0.0.0/0`
3. **密码**：确认密码是 `cjwericv`

## 📝 验证修复

重启后，检查：
1. 终端中不再有认证错误
2. 可以正常登录
3. 可以正常访问数据库

## ⚠️ 重要提示

- Next.js 只在启动时读取 `.env.local`
- 修改环境变量后必须重启服务器
- Prisma Client 需要重新生成才能使用新的连接配置

