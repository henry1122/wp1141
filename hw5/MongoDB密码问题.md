# MongoDB 认证失败问题

## 🔴 当前错误

```
SCRAM failure: bad auth : authentication failed
```

## 📋 当前配置

- **用户名**: `hocashi`
- **密码（编码）**: `P%40qq3849cjwericv`
- **密码（原始）**: `P@qq3849cjwericv`
- **集群**: `cluster0.suswhjg.mongodb.net`
- **数据库**: `my-x`

## ✅ 解决步骤

### 1. 确认 MongoDB Atlas 中的实际密码

请登录 [MongoDB Atlas](https://cloud.mongodb.com/)：
1. 前往 **Database Access**
2. 找到用户 `hocashi`
3. 点击 **Edit** 或 **Show** 查看实际密码
4. **确认密码是否真的是 `P@qq3849cjwericv`**

### 2. 如果密码不同

如果实际密码不同，请告诉我正确的密码，我会帮您更新。

### 3. 如果密码正确但仍失败

可能的原因：
1. **密码已更改但未更新连接字符串**
   - 在 MongoDB Atlas 中重置密码
   - 更新 `.env.local` 中的 `DATABASE_URL`

2. **IP 白名单问题**
   - 前往 **Network Access**
   - 确保添加了 `0.0.0.0/0`（允许所有 IP）

3. **用户权限问题**
   - 确保用户 `hocashi` 有读写权限

### 4. 重置密码（推荐）

如果无法确认密码，可以重置：

1. 登录 MongoDB Atlas
2. 前往 **Database Access**
3. 找到用户 `hocashi`
4. 点击 **Edit**
5. 点击 **Edit Password**
6. 设置新密码（记住这个密码）
7. 告诉我新密码，我会更新连接字符串

## 🔧 更新连接字符串

一旦确认了正确的密码，我会：
1. 对密码进行 URL 编码
2. 更新 `.env.local` 中的 `DATABASE_URL`
3. 测试连接确保正常工作

## 📝 密码 URL 编码规则

如果密码包含特殊字符：
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

