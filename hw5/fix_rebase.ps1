$file = $args[0]
$content = Get-Content $file -Raw
$content = $content -replace '^pick ded26195', 'edit ded26195'
Set-Content $file $content -NoNewline

