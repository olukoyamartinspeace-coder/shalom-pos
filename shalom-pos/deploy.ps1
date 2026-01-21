# Deploy Shalom POS to Surge.sh

Write-Host "🚀 Starting Deployment for Shalom POS..." -ForegroundColor Cyan

# Check if Node.js is installed
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Run Surge
Write-Host "📦 Deploying to Surge.sh..." -ForegroundColor Yellow
Write-Host "ℹ️  If this is your first time, you will be asked to create an account (email/password)." -ForegroundColor Gray
Write-Host "ℹ️  Press Enter to accept the default domain or type a custom one." -ForegroundColor Gray

npx surge ./

Write-Host "✅ Deployment process finished!" -ForegroundColor Green
Write-Host "🌍 Your app should be live at the domain shown above." -ForegroundColor Cyan
