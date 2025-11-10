# 详细诊断 Callback 错误

## 🔍 问题分析

`error=Callback` 错误表示 NextAuth 在处理 OAuth 回调时遇到了问题。这通常发生在：

1. **数据库连接失败** - Prisma adapter 无法连接到 MongoDB
2. **Session 创建失败** - 无法在数据库中创建 session
3. **用户创建失败** - Prisma adapter 无法创建用户记录
4. **环境变量问题** - NextAuth 配置不完整

## 📋 检查清单

### ✅ 已确认正常
- ✅ 数据库连接正常（`npx prisma db push` 成功）
- ✅ `.env.local` 文件存在且包含必要的环境变量
- ✅ Prisma schema 已同步

### 🔍 需要检查

1. **查看终端日志**
   - 重启服务器后，尝试登录
   - 查看终端中是否有 `[NextAuth API]`、`[NextAuth SignIn]`、`[NextAuth Session]` 日志
   - 如果有错误，应该会显示详细的错误信息

2. **检查 MongoDB Atlas**
   - 确认集群状态为 **Running**
   - 确认 IP 白名单包含 `0.0.0.0/0`（允许所有 IP）
   - 确认数据库用户权限为 **Read and write to any database**

3. **检查 NextAuth 配置**
   - 确认 `NEXTAUTH_URL` 和 `NEXTAUTH_SECRET` 已设置
   - 确认 OAuth provider 凭据正确

## 🚀 诊断步骤

### 步骤 1: 查看终端日志

重启服务器后，尝试登录，终端应该显示：

```
[NextAuth API] ===== Callback Request =====
[NextAuth API] NEXTAUTH_URL: http://localhost:3000
[NextAuth API] NEXTAUTH_SECRET: Set
[NextAuth SignIn] ===== Sign In Callback =====
[NextAuth SignIn] User email: ...
[NextAuth SignIn] Provider: google
[NextAuth SignIn] ✅ Database connection OK
[NextAuth SignIn] ✅ Allowing sign in
[NextAuth Session] ===== Session Callback =====
[NextAuth Session] ✅ Database connection OK
```

**如果没有看到这些日志，或者看到错误信息，请分享完整的终端输出。**

### 步骤 2: 测试数据库连接

运行以下命令测试数据库连接：

```bash
npx prisma db push
```

如果成功，说明数据库连接正常。

### 步骤 3: 检查 MongoDB Atlas

1. 登录 [MongoDB Atlas](https://cloud.mongodb.com/)
2. 检查 **Network Access**：
   - 确认包含 `0.0.0.0/0`（允许所有 IP）
3. 检查 **Database Access**：
   - 确认用户权限为 **Read and write to any database**
4. 检查 **Clusters**：
   - 确认集群状态为 **Running**

## 🔧 可能的解决方案

### 方案 1: 清除所有 session 和用户数据

如果数据库中有损坏的数据，可能需要清除：

```bash
# 使用 Prisma Studio 手动删除
npx prisma studio
```

或者直接在 MongoDB Atlas 中删除 `sessions` 和 `users` 集合。

### 方案 2: 重新生成 Prisma Client

```bash
npx prisma generate
```

### 方案 3: 检查 DATABASE_URL 格式

确认 `DATABASE_URL` 格式正确：
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

注意：
- 密码中的特殊字符需要 URL 编码（`@` → `%40`）
- 数据库名称应该是 `my-x`

## 📝 下一步

1. **重启开发服务器**
2. **尝试登录**
3. **查看终端日志**
4. **分享完整的错误信息**（如果有）

这样我可以更准确地诊断问题。

