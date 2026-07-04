param(
  [Parameter(Mandatory = $true)]
  [string]$TextPath,

  [Parameter(Mandatory = $true)]
  [string]$OutPath
)

$resolvedTextPath = Resolve-Path -LiteralPath $TextPath
$text = Get-Content -LiteralPath $resolvedTextPath -Raw
$outDirectory = Split-Path -Parent $OutPath

if (!(Test-Path -LiteralPath $outDirectory)) {
  New-Item -ItemType Directory -Force -Path $outDirectory | Out-Null
}

$speaker = New-Object -ComObject SAPI.SpVoice
$speaker.Rate = 0
$speaker.Volume = 100

$frenchVoice = $speaker.GetVoices() |
  Where-Object { $_.GetDescription() -like "*French*" -or $_.GetDescription() -like "*Hortense*" } |
  Select-Object -First 1

if ($frenchVoice) {
  $speaker.Voice = $frenchVoice
}

$stream = New-Object -ComObject SAPI.SpFileStream
$stream.Format.Type = 22
$stream.Open($OutPath, 3, $false)
$speaker.AudioOutputStream = $stream
$speaker.Speak($text) | Out-Null
$stream.Close()
