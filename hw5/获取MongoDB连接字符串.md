# 获取正确的 MongoDB 连接字符串

## 🔴 当前问题

所有配置都能连接到服务器，但认证失败。这说明：
- ✅ 网络连接正常
- ✅ 集群地址正确
- ❌ 用户名或密码不正确

## ✅ 推荐解决方案：直接从 MongoDB Atlas 获取连接字符串

### 步骤 1: 获取连接字符串

1. 登录 [MongoDB Atlas](https://cloud.mongodb.com/)
2. 点击 **Connect** 按钮（在您的集群旁边）
3. 选择 **Connect your application**
4. 选择：
   - **Driver**: `Node.js`
   - **Version**: `5.5 or later`
5. **复制连接字符串**（格式类似：`mongodb+srv://hocashi:<password>@cluster0.suswhjg.mongodb.net/...`）

### 步骤 2: 替换密码

在复制的连接字符串中：
- 将 `<password>` 替换为实际密码：`cjwericv`
- 如果连接字符串中没有数据库名称，在 `@cluster0...mongodb.net/` 后面添加 `my-x`

### 步骤 3: 告诉我连接字符串

请将完整的连接字符串（已替换密码）告诉我，我会：
1. 更新 `.env.local` 文件
2. 测试连接
3. 确认一切正常

## 🔍 其他可能的问题

### 1. 密码更新需要时间

如果刚更新密码，请等待 **5-10 分钟** 后再试。

### 2. 检查 IP 白名单

1. 前往 **Network Access**
2. 确认有 `0.0.0.0/0`（允许所有 IP）
3. 如果没有，点击 **Add IP Address** → **Allow Access from Anywhere**

### 3. 检查用户权限

1. 在 **Database Access** 中
2. 找到用户 `hocashi`
3. 确认用户有 **Read and write to any database** 权限

### 4. 重新创建用户（如果以上都不行）

1. 删除用户 `hocashi`
2. 创建新用户：
   - Username: `hocashi`
   - Password: `cjwericv`
   - Database User Privileges: **Read and write to any database**
3. 等待 2-3 分钟
4. 从 MongoDB Atlas 获取新的连接字符串

## 📝 请提供

请从 MongoDB Atlas 复制完整的连接字符串（已替换密码），格式应该类似：
```
mongodb+srv://hocashi:cjwericv@cluster0.suswhjg.mongodb.net/my-x?retryWrites=true&w=majority
```

