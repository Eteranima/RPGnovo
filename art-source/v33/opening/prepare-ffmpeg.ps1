[CmdletBinding()]
param([string]$PackageVersion = '9.0.2')

$ErrorActionPreference = 'Stop'
if ($PackageVersion -notmatch '^\d+\.\d+\.\d+$') { throw 'Use a numeric release version.' }
$repoRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..'))
$stagePath = [IO.Path]::GetFullPath((Join-Path $repoRoot '.agents/v33-ffmpeg'))
$repoPrefix = $repoRoot.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
if (-not $stagePath.StartsWith($repoPrefix, [StringComparison]::OrdinalIgnoreCase)) { throw 'Portable tools must stay inside this checkout.' }
& git -C $repoRoot check-ignore -q -- (Join-Path $stagePath 'runtime.json')
if ($LASTEXITCODE -ne 0) { throw 'The portable directory must be ignored by Git.' }
New-Item -ItemType Directory -Path $stagePath -Force | Out-Null

# Windows vendor linked directly by https://ffmpeg.org/download.html.
$packageName = "ffmpeg-$PackageVersion-essentials_build.zip"
$packageUrl = "https://www.gyan.dev/ffmpeg/builds/packages/$packageName"
$checksumUrl = "$packageUrl.sha256"
$archivePath = Join-Path $stagePath $packageName
$checksumReply = Invoke-WebRequest -Uri $checksumUrl -UseBasicParsing
$checksumText = if ($checksumReply.Content -is [byte[]]) { [Text.Encoding]::UTF8.GetString($checksumReply.Content) } else { [string]$checksumReply.Content }
$expectedHash = [regex]::Match($checksumText, '\b[a-fA-F0-9]{64}\b').Value.ToLowerInvariant()
if (-not $expectedHash) { throw 'The vendor did not return a SHA-256 checksum.' }
if (-not (Test-Path -LiteralPath $archivePath)) { Invoke-WebRequest -Uri $packageUrl -OutFile $archivePath -UseBasicParsing }
$actualHash = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actualHash -ne $expectedHash) { throw 'Package checksum mismatch; do not execute this archive.' }

$packagePath = [IO.Path]::GetFullPath((Join-Path $stagePath "package-$PackageVersion"))
$stagePrefix = $stagePath.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
if (-not $packagePath.StartsWith($stagePrefix, [StringComparison]::OrdinalIgnoreCase)) { throw 'Invalid extraction path.' }
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::OpenRead($archivePath)
try {
  $packagePrefix = $packagePath.TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
  foreach ($entry in $zip.Entries) {
    $entryTarget = [IO.Path]::GetFullPath((Join-Path $packagePath $entry.FullName))
    if (-not $entryTarget.StartsWith($packagePrefix, [StringComparison]::OrdinalIgnoreCase)) { throw 'Archive entry escapes the portable directory.' }
  }
} finally { $zip.Dispose() }

New-Item -ItemType Directory -Path $packagePath -Force | Out-Null
Expand-Archive -LiteralPath $archivePath -DestinationPath $packagePath -Force
$ffmpegFiles = @(Get-ChildItem -LiteralPath $packagePath -Filter ffmpeg.exe -Recurse -File)
$ffprobeFiles = @(Get-ChildItem -LiteralPath $packagePath -Filter ffprobe.exe -Recurse -File)
if ($ffmpegFiles.Count -ne 1 -or $ffprobeFiles.Count -ne 1) { throw 'Expected one matching ffmpeg and ffprobe pair.' }
$ffmpegPath = $ffmpegFiles[0].FullName
$ffprobePath = $ffprobeFiles[0].FullName
$versionOutput = & $ffmpegPath -version
if ($LASTEXITCODE -ne 0) { throw 'The verified portable FFmpeg cannot run.' }
$runtime = [ordered]@{
  officialDownloadPage = 'https://ffmpeg.org/download.html'
  vendorPage = 'https://www.gyan.dev/ffmpeg/builds/'
  packageUrl = $packageUrl
  checksumUrl = $checksumUrl
  version = $PackageVersion
  archiveSHA256 = $actualHash
  ffmpeg = $ffmpegPath
  ffprobe = $ffprobePath
  ffmpegSHA256 = (Get-FileHash -LiteralPath $ffmpegPath -Algorithm SHA256).Hash.ToLowerInvariant()
  ffprobeSHA256 = (Get-FileHash -LiteralPath $ffprobePath -Algorithm SHA256).Hash.ToLowerInvariant()
  versionLine = $versionOutput[0]
}
[IO.File]::WriteAllText((Join-Path $stagePath 'runtime.json'), ($runtime | ConvertTo-Json -Depth 4) + "`n", [Text.UTF8Encoding]::new($false))
$runtime | ConvertTo-Json -Depth 4
# No installation, PATH change, settings change or shell-based UI automation occurs.
