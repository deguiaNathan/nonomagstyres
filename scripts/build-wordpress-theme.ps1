$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$themeRoot = Join-Path $repoRoot 'wordpress-theme\nonomags-exact'
$themeAppRoot = Join-Path $themeRoot 'assets\app'
$distRoot = Join-Path $repoRoot 'dist'
$themeZip = Join-Path $repoRoot 'wordpress-theme\nonomags-exact.zip'
$screenshotSource = Join-Path $repoRoot 'src\assets\816c6100956f5aac7a092fa4154e0f1777af18d0.png'

Push-Location $repoRoot
try {
  npm run build
} finally {
  Pop-Location
}

if (Test-Path -LiteralPath $themeAppRoot) {
  Remove-Item -LiteralPath $themeAppRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $themeAppRoot -Force | Out-Null
Copy-Item -Path (Join-Path $distRoot '*') -Destination $themeAppRoot -Recurse -Force

if (Test-Path -LiteralPath $screenshotSource) {
  Copy-Item -LiteralPath $screenshotSource -Destination (Join-Path $themeRoot 'screenshot.png') -Force
}

if (Test-Path -LiteralPath $themeZip) {
  Remove-Item -LiteralPath $themeZip -Force
}

Compress-Archive -LiteralPath $themeRoot -DestinationPath $themeZip -Force

Write-Host "WordPress theme bundle created at: $themeZip"
