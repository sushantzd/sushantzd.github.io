# Build the SYNAPSE static site and publish it to the `gh-pages` branch,
# which GitHub Pages serves at https://sushantzd.github.io/
#
# Usage (from the project root, in PowerShell):
#   ./deploy.ps1
#
# To make the contact form live, first put your free Web3Forms key in .env.local:
#   NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_key_here
# then run this script again (the key is baked in at build time).

$ErrorActionPreference = "Stop"

Write-Host "Building static export..." -ForegroundColor Cyan
npm run build

Push-Location out
try {
    if (Test-Path .git) { Remove-Item -Recurse -Force .git }
    git init -q
    git config user.email "sushantchoudhary912@gmail.com"
    git config user.name  "Sushant Choudhary"
    git checkout -q -b gh-pages
    git add -A
    git commit -q -m "deploy: static site"
    Write-Host "Publishing to gh-pages..." -ForegroundColor Cyan
    git push -q --force "https://github.com/sushantzd/sushantzd.github.io.git" gh-pages
    Remove-Item -Recurse -Force .git
}
finally {
    Pop-Location
}

Write-Host "`nDeployed. Live in ~30-60s at https://sushantzd.github.io/" -ForegroundColor Green
