# Cleanup script for removing i18n files
Write-Host "🧹 Cleaning up i18n files..." -ForegroundColor Yellow

# Remove [locale] folder
if (Test-Path "src\app\[locale]") {
    Remove-Item -Recurse -Force "src\app\[locale]"
    Write-Host "✅ Removed src\app\[locale] folder" -ForegroundColor Green
}

# Remove i18n.ts
if (Test-Path "src\i18n.ts") {
    Remove-Item -Force "src\i18n.ts"
    Write-Host "✅ Removed src\i18n.ts" -ForegroundColor Green
}

# Remove LanguageSwitcher component
if (Test-Path "src\components\LanguageSwitcher.tsx") {
    Remove-Item -Force "src\components\LanguageSwitcher.tsx"
    Write-Host "✅ Removed LanguageSwitcher component" -ForegroundColor Green
}

# Remove messages folder
if (Test-Path "messages") {
    Remove-Item -Recurse -Force "messages"
    Write-Host "✅ Removed messages folder" -ForegroundColor Green
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Run: npm uninstall next-intl" -ForegroundColor Cyan
Write-Host "  2. Run: npm run build" -ForegroundColor Cyan
