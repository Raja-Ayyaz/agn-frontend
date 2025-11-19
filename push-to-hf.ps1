# Quick push to Hugging Face Space
# Usage: .\push-to-hf.ps1 "your commit message"

param(
    [string]$message = "Update backend"
)

Write-Host "🚀 Pushing to Hugging Face Space..." -ForegroundColor Cyan
Write-Host ""

# Stage all changes
Write-Host "📦 Staging changes..." -ForegroundColor Yellow
git add -A

# Commit with provided message
Write-Host "💾 Committing: $message" -ForegroundColor Yellow
git commit -m $message

# Push to Hugging Face
Write-Host "⬆️  Pushing to Hugging Face..." -ForegroundColor Yellow
git push huggingface add-readme-to-main:main

Write-Host ""
Write-Host "✅ Done! Check your Space at: https://huggingface.co/spaces/AGN768/backend" -ForegroundColor Green
