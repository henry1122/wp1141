# 修复 Google 和 GitHub 登录问题

## 🔍 问题分析

### 问题 1: 只有特定 Gmail 能登录

**原因：**
- Google Cloud Console 中可能设置了 **测试用户限制**
- 只有添加到测试用户列表的邮箱才能登录

**解决方法：**
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择您的项目
3. 前往 **APIs & Services** → **OAuth consent screen**
4. 检查 **Test users** 部分
5. **如果应用处于 "Testing" 状态：**
   - 需要将所有要使用的 Gmail 添加到测试用户列表
   - 或者将应用发布为 **Production**（推荐）

### 问题 2: 登录后直接是 guest 账户

**原因：**
- 浏览器中有 guest 账户的 session cookie
- 数据库中 guest 账户有有效的 session

**已修复：**
- ✅ 在登录前自动清除所有 session（包括 guest）
- ✅ 在 session callback 中检测并阻止 guest 账户自动登录

### 问题 3: GitHub 无法登录

**可能原因：**
1. GitHub OAuth App 的 Callback URL 配置不正确
2. GitHub OAuth App 处于测试模式
3. 环境变量配置错误

## 🔧 修复步骤

### 步骤 1: 修复 Google OAuth 配置

#### 选项 A: 添加测试用户（如果应用在测试模式）

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择您的项目
3. 前往 **APIs & Services** → **OAuth consent screen**
4. 在 **Test users** 部分，点击 **+ ADD USERS**
5. 添加所有要使用的 Gmail 地址
6. 点击 **SAVE**

#### 选项 B: 发布应用为 Production（推荐）

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择您的项目
3. 前往 **APIs & Services** → **OAuth consent screen**
4. 点击 **PUBLISH APP**
5. 确认发布

**注意：** 发布为 Production 后，所有 Gmail 用户都可以登录，无需添加到测试用户列表。

### 步骤 2: 检查 GitHub OAuth 配置

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 找到您的 OAuth App（Client ID: `Ov23li5FSncnEeL7QcHK`）
3. 点击进入应用设置
4. **确认 Authorization callback URL 设置为：**
   ```
   http://localhost:3000/api/auth/callback/github
   ```
   ⚠️ **必须完全匹配**

5. **检查应用状态：**
   - 如果应用处于测试模式，可能需要添加测试用户
   - 或者将应用设置为公开

### 步骤 3: 清除浏览器缓存和 Cookies

1. 按 `F12` 打开开发者工具
2. 在 **Application** 标签中：
   - 清除所有 **Cookies**（特别是 `localhost:3000` 的 cookies）
   - 清除 **Local Storage**
   - 清除 **Session Storage**
3. 或使用**无痕模式**测试

### 步骤 4: 清除 Guest Session

访问以下 URL 清除数据库中 guest 账户的 session：
```
http://localhost:3000/api/auth/clear-guest-session
```

或使用 curl：
```bash
curl -X POST http://localhost:3000/api/auth/clear-guest-session
```

## ✅ 已完成的修复

1. ✅ 更新了 Google OAuth 配置，移除了可能的域名限制
2. ✅ 在登录前自动清除所有 session（包括 guest）
3. ✅ 在 session callback 中检测并阻止 guest 账户自动登录
4. ✅ 添加了详细的日志记录，便于诊断问题

## 🧪 测试步骤

1. **清除浏览器缓存和 cookies**
2. **清除 guest session**（访问 `/api/auth/clear-guest-session`）
3. **重启开发服务器**
4. **测试 Google 登录**：
   - 使用不同的 Gmail 账户登录
   - 应该能正常登录并跳转到注册页面
5. **测试 GitHub 登录**：
   - 点击 "Continue with GitHub"
   - 完成授权
   - 查看终端日志获取详细错误信息

## 📝 如果问题仍然存在

### Google 登录问题

**检查：**
1. Google Cloud Console 中的 OAuth consent screen 设置
2. 应用是否处于测试模式
3. 测试用户列表是否包含要使用的邮箱

**查看终端日志：**
- 应该会显示 `[NextAuth SignIn]` 日志
- 如果有错误，会显示详细的错误信息

### GitHub 登录问题

**检查：**
1. GitHub OAuth App 的 Callback URL 配置
2. 应用状态（测试模式 vs 公开）
3. 环境变量 `GITHUB_ID` 和 `GITHUB_SECRET` 是否正确

**查看终端日志：**
- 应该会显示 `[NextAuth API]` 和 `[NextAuth SignIn]` 日志
- 如果有错误，会显示详细的错误信息

## 🔗 相关链接

- [Google Cloud Console](https://console.cloud.google.com/)
- [GitHub Developer Settings](https://github.com/settings/developers)
- [NextAuth.js 文档](https://next-auth.js.org/)

