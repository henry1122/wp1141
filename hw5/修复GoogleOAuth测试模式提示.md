# 修复 Google OAuth "开发者信息" 提示

## 🔍 问题说明

Google 登录页面显示"开发者信息"模态框，这是因为：
- Google OAuth 应用处于**测试模式**（Testing mode）
- 这是 Google 的正常安全机制

## ✅ 解决方案

### 方法 1: 添加测试用户（推荐，最简单）

1. **访问 Google Cloud Console**
   - 前往：https://console.cloud.google.com/
   - 选择您的项目

2. **前往 OAuth 同意屏幕**
   - 左侧菜单 → **APIs & Services** → **OAuth consent screen**

3. **添加测试用户**
   - 在 **Test users** 部分
   - 点击 **+ ADD USERS**
   - 添加您的 Google 邮箱：`hrjhang1122@gmail.com`
   - 点击 **ADD**

4. **保存并测试**
   - 保存更改
   - 等待 1-2 分钟
   - 重新尝试登录

### 方法 2: 将应用设置为"内部"（仅限 Google Workspace）

如果您使用的是 Google Workspace 组织：

1. **访问 OAuth 同意屏幕**
   - Google Cloud Console → **APIs & Services** → **OAuth consent screen**

2. **更改用户类型**
   - 将 **User Type** 从 **External** 改为 **Internal**
   - 这样只有组织内的用户可以访问，不需要验证

### 方法 3: 发布应用到生产环境（需要验证）

如果您想完全移除提示，需要：

1. **完成 OAuth 同意屏幕配置**
   - 填写所有必需信息
   - 上传应用图标和隐私政策

2. **提交验证**
   - 点击 **PUBLISH APP**
   - 等待 Google 审核（可能需要几天）

## 📝 当前配置检查

请确认以下配置：

### OAuth 同意屏幕设置

1. **应用名称**：My-X（或您的应用名称）
2. **用户支持电子邮件**：您的邮箱
3. **开发者联系信息**：您的邮箱
4. **应用域名**：`localhost:3000`（开发环境）
5. **授权域名**：`localhost`（开发环境）

### 测试用户

确保以下邮箱已添加到测试用户列表：
- `hrjhang1122@gmail.com`
- 其他需要测试的邮箱

## ⚠️ 重要提示

- **测试模式限制**：
  - 最多 100 个测试用户
  - 测试用户需要明确添加到列表中
  - 非测试用户无法登录

- **生产模式**：
  - 需要 Google 验证
  - 任何人都可以登录
  - 不需要添加测试用户

## 🚀 快速修复步骤

1. 访问：https://console.cloud.google.com/apis/credentials/consent
2. 找到 **Test users** 部分
3. 点击 **+ ADD USERS**
4. 添加 `hrjhang1122@gmail.com`
5. 保存
6. 等待 1-2 分钟
7. 重新尝试登录

添加测试用户后，"开发者信息"提示仍然会显示，但您可以正常登录。

