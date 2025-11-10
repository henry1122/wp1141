# MongoDB 连接字符串更新说明

## 📝 您提供的连接字符串

您提供的 MongoDB 连接字符串格式：
```
mongodb+srv://hocashi:<db_password>@cluster0.suswhjg.mongodb.net/?appName=Cluster0
```

## ✅ 已更新的连接字符串

我已经将 `.env.local` 中的 `DATABASE_URL` 更新为：
```
DATABASE_URL=mongodb+srv://hocashi:P%40qq3849@cluster0.suswhjg.mongodb.net/my-x?retryWrites=true&w=majority
```

**说明：**
- 用户名：`hocashi`
- 密码：`P@qq3849`（URL 编码为 `P%40qq3849`）
- 集群地址：`cluster0.suswhjg.mongodb.net`
- 数据库名称：`my-x`
- 参数：`retryWrites=true&w=majority`（确保写入可靠性）

## 🔄 如果您想使用不同的密码

如果您想使用不同的密码，请：

1. **获取您的 MongoDB Atlas 密码**
   - 登录 [MongoDB Atlas](https://cloud.mongodb.com/)
   - 前往 Database Access
   - 找到用户 `hocashi` 的密码

2. **更新 `.env.local`**
   - 打开 `.env.local` 文件
   - 找到 `DATABASE_URL` 行
   - 将 `<db_password>` 替换为您的实际密码（注意：如果密码包含特殊字符，需要进行 URL 编码）
   - 例如：如果密码是 `MyP@ssword`，则应该编码为 `MyP%40ssword`

3. **URL 编码规则**
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`
   - `%` → `%25`
   - `&` → `%26`
   - `+` → `%2B`
   - `=` → `%3D`
   - `?` → `%3F`

## 🧪 测试连接

更新后，运行以下命令测试连接：

```bash
npx prisma db push
```

如果成功，您会看到：
```
✔ Generated Prisma Client
✔ Pushed database schema
```

## ⚠️ 重要提示

1. **IP 白名单**：确保 MongoDB Atlas 的 Network Access 中允许您的 IP 地址（或使用 `0.0.0.0/0` 允许所有 IP）
2. **数据库名称**：当前使用 `my-x`，您可以根据需要修改
3. **安全性**：不要将 `.env.local` 文件提交到 Git 仓库

