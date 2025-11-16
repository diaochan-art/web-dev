# push_site.ps1
# Helper: commit contents of _site to git branch gh-pages and push
# Usage: run from repository root (where blog_elev folder is)
# Requires Git available in PATH

param(
  [string]$siteDir = "blog_elev\_site",
  [string]$branch = "gh-pages"
)

$ErrorActionPreference = 'Stop'

Write-Host "Preparing to push $siteDir to branch $branch"
if (-not (Test-Path $siteDir)) {
  Write-Error "Site directory '$siteDir' not found. Run 'npm run build' or use prebuilt _site."
  exit 1
}

# Create temporary worktree
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$tempBranch = "site-${timestamp}"

git checkout --orphan $tempBranch
git --work-tree $siteDir add --all
git --work-tree $siteDir commit -m "chore: publish site snapshot $timestamp"

# Force update gh-pages branch
git branch -M $branch
git push origin $branch --force

# Return to main branch
git checkout -
Write-Host "Pushed $siteDir to branch $branch"
