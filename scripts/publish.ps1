[CmdletBinding()]
param(
    [string]$Message = "Daily LeetCode practice",
    [switch]$NoPush
)

$ErrorActionPreference = "Stop"
$repo = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Set-Location $repo

function Fail([string]$Text) {
    Write-Error $Text
    exit 1
}

if (-not (Test-Path (Join-Path $repo ".git"))) {
    Fail "Not a git repository: $repo"
}

# --- Git identity (repo-local) -------------------------------------------------
$name = git config --get user.name
$email = git config --get user.email
if (-not $name) { git config user.name "ChenLin" }
if (-not $email) { git config user.email "202421324910@m.scnu.edu.cn" }

# --- TLS: combine Git's CA bundle with the local SteamTools root --------------
# GitHub is reached through the local Watt Toolkit / SteamTools proxy on this
# machine, which presents a certificate signed by its own root CA. Combining the
# roots keeps normal GitHub certificates working too, if the proxy is bypassed.
$certDir = Join-Path (Split-Path $repo -Parent) ".certs"
New-Item -ItemType Directory -Force -Path $certDir | Out-Null
$caFile = Join-Path $certDir "github-ca.pem"

$gitRoot = Split-Path (Split-Path (git --exec-path) -Parent) -Parent
$gitCaBundle = Join-Path $gitRoot "etc\ssl\certs\ca-bundle.crt"
$parts = @()
if (Test-Path $gitCaBundle) {
    $parts += (Get-Content -Raw -Path $gitCaBundle)
}
$steamRoot = Get-ChildItem Cert:\LocalMachine\Root -ErrorAction SilentlyContinue |
    Where-Object { $_.Subject -like "*CN=SteamTools Certificate*" } |
    Select-Object -First 1
if ($steamRoot) {
    $pemBody = [Convert]::ToBase64String($steamRoot.RawData, "InsertLineBreaks")
    $parts += "-----BEGIN CERTIFICATE-----`n$pemBody`n-----END CERTIFICATE-----"
}
if ($parts.Count -gt 0) {
    [IO.File]::WriteAllText($caFile, ($parts -join "`n") + "`n")
} elseif (-not (Test-Path $caFile)) {
    Fail "No CA bundle available; cannot verify GitHub TLS."
}
git config http.sslBackend openssl
git config http.sslCAInfo ($caFile -replace "\\", "/")

# --- Commit --------------------------------------------------------------------
git add -A
git diff --cached --quiet
$hasStaged = ($LASTEXITCODE -ne 0)
if ($hasStaged) {
    git commit -m $Message
    if ($LASTEXITCODE -ne 0) { Fail "git commit failed." }
    Write-Host "Committed: $Message"
} else {
    Write-Host "No new changes to commit."
}

if ($NoPush) {
    Write-Host "NoPush set; stopping before remote sync."
    exit 0
}

# --- Credentials ---------------------------------------------------------------
# The DSH sandbox blocks the shell used by git credential helpers, so read the
# Windows Credential Manager entry directly and pass it through an environment
# config entry (never on the command line, never written to disk).
$helper = Join-Path (git --exec-path) "git-credential-wincred.exe"
if (-not (Test-Path $helper)) {
    Fail "git-credential-wincred.exe not found; cannot read the stored GitHub token."
}

$credentialLines = @("protocol=https", "host=github.com", "") | & $helper get 2>$null
$user = ($credentialLines | Where-Object { $_ -like "username=*" } | Select-Object -First 1) -replace "^username=", ""
$pass = ($credentialLines | Where-Object { $_ -like "password=*" } | Select-Object -First 1) -replace "^password=", ""
if (-not $user -or -not $pass) {
    Fail "No GitHub credential found in Windows Credential Manager (git:https://github.com)."
}

$basic = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("${user}:${pass}"))
$saved = @{}
foreach ($key in @("GIT_CONFIG_COUNT", "GIT_CONFIG_KEY_0", "GIT_CONFIG_VALUE_0", "GIT_TERMINAL_PROMPT")) {
    $saved[$key] = [Environment]::GetEnvironmentVariable($key, "Process")
}

try {
    $env:GIT_TERMINAL_PROMPT = "0"
    $env:GIT_CONFIG_COUNT = "1"
    $env:GIT_CONFIG_KEY_0 = "http.extraHeader"
    $env:GIT_CONFIG_VALUE_0 = "Authorization: Basic $basic"

    # --- Sync with the remote --------------------------------------------------
    git fetch origin main
    if ($LASTEXITCODE -ne 0) {
        Fail "git fetch failed. Check that Watt Toolkit/SteamTools is running and GitHub is reachable."
    }

    git merge --ff-only origin/main
    if ($LASTEXITCODE -ne 0) {
        Fail "Local branch has diverged from origin/main. Resolve manually (rebase or merge) before retrying."
    }

    # --- Push ------------------------------------------------------------------
    git push origin main
    if ($LASTEXITCODE -ne 0) {
        Fail "git push failed. The commit is kept locally and will be pushed on the next run."
    }

    git fetch origin main --quiet
    $head = git rev-parse HEAD
    $remote = git rev-parse origin/main
    if ($LASTEXITCODE -ne 0 -or $head -ne $remote) {
        Fail "Push finished but origin/main does not match HEAD."
    }

    $short = git rev-parse --short HEAD
    Write-Host "PUSHED $short -> origin/main"
    Write-Host "URL https://github.com/Charlene0000/LeetCode-practice/commit/$head"
} finally {
    foreach ($key in $saved.Keys) {
        if ($null -eq $saved[$key]) {
            Remove-Item "Env:$key" -ErrorAction SilentlyContinue
        } else {
            Set-Item "Env:$key" $saved[$key]
        }
    }
}
