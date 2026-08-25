$ErrorActionPreference = "Stop"
Write-Host "PEPS GLOBAL - Git push helper" -ForegroundColor Cyan
if (-not (Test-Path ".git")) {
  Write-Host "This folder is not a Git repository yet." -ForegroundColor Yellow
  Write-Host "Run: git init" 
  Write-Host "Then add your GitHub remote: git remote add origin YOUR_REPO_URL"
}
git add .
git commit -m "Launch PEPS GLOBAL website"
git branch -M main
git push -u origin main
