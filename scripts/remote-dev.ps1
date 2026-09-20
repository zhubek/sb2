param([ValidateSet('sync','watch','stop','status','logs')][string]$Action='status')
$ErrorActionPreference='Stop'
$projectRoot=Split-Path -Parent $PSScriptRoot
$stateDirectory=Join-Path $projectRoot '.data/remote-dev'
$pidFile=Join-Path $stateDirectory 'watch.pid'
$syncScript=Join-Path $PSScriptRoot 'remote-sync.py'
New-Item -ItemType Directory -Force -Path $stateDirectory | Out-Null
function Get-SyncProcess {
  if(Test-Path -LiteralPath $pidFile){
    $syncProcessId=[int](Get-Content -LiteralPath $pidFile)
    $syncProcess=Get-CimInstance Win32_Process -Filter "ProcessId = $syncProcessId"
    if($syncProcess -and $syncProcess.CommandLine.Contains($syncScript) -and $syncProcess.CommandLine.Contains('--watch')){return $syncProcess}
  }
  return $null
}
switch($Action){
  'sync' { & python -X utf8 $syncScript; exit $LASTEXITCODE }
  'watch' {
    if(Get-SyncProcess){Write-Output 'Source synchronization is already running';break}
    $syncProcess=Start-Process -FilePath (Get-Command python).Source -ArgumentList @('-X','utf8','-u',('"'+$syncScript+'"'),'--watch') -WindowStyle Hidden -WorkingDirectory $projectRoot -RedirectStandardOutput (Join-Path $stateDirectory 'watch.log') -RedirectStandardError (Join-Path $stateDirectory 'watch-error.log') -PassThru
    Set-Content -LiteralPath $pidFile -Value $syncProcess.Id
    Write-Output 'Source synchronization started. Logs: .data/remote-dev/watch.log'
  }
  'stop' {
    $syncProcess=Get-SyncProcess
    if($syncProcess){Stop-Process -Id $syncProcess.ProcessId;Write-Output 'Source synchronization stopped'}
  }
  'status' {
    if(Get-SyncProcess){Write-Output 'Local source synchronization: running'}else{Write-Output 'Local source synchronization: stopped'}
    & ssh -o BatchMode=yes zhumirov@136.112.254.16 'systemctl is-active sb2-dev-db sb2-dev-api sb2-dev-web; df -h /mnt/sb2dev'
  }
  'logs' { & ssh -o BatchMode=yes zhumirov@136.112.254.16 'journalctl -u sb2-dev-api -u sb2-dev-web -n 60 --no-pager' }
}
