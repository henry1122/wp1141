# 重启开发服务器脚本
Write-Host "正在停止开发服务器..." -ForegroundColor Yellow

# 查找并停止 node 进程（运行 Next.js 的）
$processes = Get-Process -Name node -ErrorAction SilentlyContinue
if ($processes) {
    Write-Host "找到 $($processes.Count) 个 node 进程" -ForegroundColor Yellow
    $processes | ForEach-Object {
        Write-Host "停止进程 ID: $($_.Id)" -ForegroundColor Yellow
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

Write-Host "清除 .next 缓存..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

Write-Host "重新生成 Prisma Client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "`n✅ 准备完成！" -ForegroundColor Green
Write-Host "请运行: npm run dev" -ForegroundColor Cyan

