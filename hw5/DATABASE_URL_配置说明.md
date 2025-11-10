# DATABASE_URL 配置说明

## 🔴 当前问题

测试显示：**认证失败（authentication failed）**

这意味着：
- ✅ 可以连接到 MongoDB Atlas 集群
- ❌ 用户名或密码不正确

## 📝 当前配置

当前 `.env.local` 中的配置：
```
DATABASE_URL=mongodb+srv://hocashi:P%40qq3849cjwericv@cluster0.suswhjg.mongodb.net/my-x?retryWrites=true&w=majority
```

**解析：**
- 用户名：`hocashi`
- 密码（URL 编码）：`P%40qq3849cjwericv`（原始密码：`P@qq3849cjwericv`）
- 集群：`cluster0.suswhjg.mongodb.net`
- 数据库：`my-x`

## ✅ 解决步骤

### 1. 确认正确的密码

请登录 [MongoDB Atlas](https://cloud.mongodb.com/)：
1. 前往 **Database Access**
2. 找到用户 `hocashi`
3. 点击 **Edit** 或 **Show** 查看密码
4. 确认实际密码是什么

### 2. 更新 DATABASE_URL

如果密码不同，请告诉我正确的密码，我会帮您更新。

**重要：** 如果密码包含特殊字符，需要进行 URL 编码：
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`

### 3. 测试连接

更新后，运行：
```bash
node test-db-connection.js
```

如果成功，您会看到：
```
✅ 连接成功！
✅ 数据库查询成功！当前用户数: X
```

## 🔧 其他可能的问题

### IP 白名单

确保 MongoDB Atlas 的 **Network Access** 中：
- 允许您的 IP 地址，或
- 使用 `0.0.0.0/0` 允许所有 IP（仅用于开发）

### 数据库用户权限

确保用户 `hocashi` 有读写权限。

## 📋 快速检查清单

- [ ] 确认 MongoDB Atlas 中 `hocashi` 用户的密码
- [ ] 更新 `.env.local` 中的 `DATABASE_URL`
- [ ] 确保密码中的特殊字符已正确 URL 编码
- [ ] 检查 IP 白名单设置
- [ ] 运行 `node test-db-connection.js` 测试连接

