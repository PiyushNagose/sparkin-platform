$ErrorActionPreference = "Continue"

$servicesDir = Resolve-Path (Join-Path $PSScriptRoot "..")
$services = @(
  @{ Name = "identity-service"; Port = 4001 },
  @{ Name = "business-service"; Port = 4002 },
  @{ Name = "fulfillment-service"; Port = 4003 },
  @{ Name = "api-gateway"; Port = 4000 }
)

$running = New-Object System.Collections.Generic.List[object]
$logPositions = @{}
$stopping = $false

function Invoke-FreeBackendPorts {
  & powershell.exe -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot "free-backend-ports.ps1")

  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

function Start-BackendService($service) {
  $servicePath = Join-Path $servicesDir $service.Name
  $logPath = Join-Path $servicePath ".dev-runner.out.log"
  $errPath = Join-Path $servicePath ".dev-runner.err.log"

  Remove-Item -LiteralPath $logPath -Force -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $errPath -Force -ErrorAction SilentlyContinue

  Write-Host "[runner] starting $($service.Name) on port $($service.Port)..."

  $process = Start-Process `
    -FilePath "powershell.exe" `
    -ArgumentList @("-NoProfile", "-Command", "npm run start") `
    -WorkingDirectory $servicePath `
    -RedirectStandardOutput $logPath `
    -RedirectStandardError $errPath `
    -WindowStyle Hidden `
    -PassThru

  $running.Add([pscustomobject]@{
    Name = $service.Name
    Process = $process
    OutLog = $logPath
    ErrLog = $errPath
  })

  $logPositions[$logPath] = 0
  $logPositions[$errPath] = 0
}

function Write-NewLogLines($serviceName, $path, $isError) {
  if (-not (Test-Path $path)) {
    return
  }

  $lines = @(Get-Content -LiteralPath $path -ErrorAction SilentlyContinue)
  $start = [int]($logPositions[$path])

  if ($lines.Count -le $start) {
    return
  }

  for ($i = $start; $i -lt $lines.Count; $i++) {
    if ([string]::IsNullOrWhiteSpace($lines[$i])) {
      continue
    }

    $line = "[$serviceName] $($lines[$i])"

    if ($isError) {
      [Console]::Error.WriteLine($line)
    } else {
      Write-Host $line
    }
  }

  $logPositions[$path] = $lines.Count
}

function Stop-BackendServices {
  if ($script:stopping) {
    return
  }

  $script:stopping = $true
  Write-Host ""
  Write-Host "[runner] stopping backend services..."

  foreach ($entry in $running) {
    if ($null -eq $entry.Process) {
      continue
    }

    $entry.Process.Refresh()

    if ($entry.Process.HasExited) {
      continue
    }

    $taskkillOutput = & taskkill /pid $entry.Process.Id /t /f 2>&1

    if ($LASTEXITCODE -ne 0) {
      $entry.Process.Refresh()

      if (-not $entry.Process.HasExited) {
        Write-Host "[runner] could not stop $($entry.Name): $($taskkillOutput -join ' ')"
      }
    }
  }

  Write-Host "[runner] backend services stopped."
}

function Wait-ForHealth($serviceName, $port, $timeoutSeconds = 30) {
  $url = "http://localhost:$port/health"
  $deadline = (Get-Date).AddSeconds($timeoutSeconds)
  Write-Host "[runner] waiting for $serviceName on port $port..."

  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
      if ($response.StatusCode -lt 500) {
        Write-Host "[runner] $serviceName is ready."
        return $true
      }
    } catch {
      # not ready yet
    }
    Start-Sleep -Milliseconds 500
  }

  Write-Host "[runner] $serviceName did not become ready in time."
  return $false
}

try {
  Invoke-FreeBackendPorts
  Write-Host "[runner] checking backend ports 4000-4003..."

  # Start downstream services first (all except api-gateway)
  foreach ($service in $services | Where-Object { $_.Name -ne "api-gateway" }) {
    Start-BackendService $service
    Start-Sleep -Milliseconds 500
  }

  # Wait for each downstream to be healthy before starting api-gateway
  foreach ($service in $services | Where-Object { $_.Name -ne "api-gateway" }) {
    $ready = Wait-ForHealth $service.Name $service.Port 30
    if (-not $ready) {
      Write-Host "[runner] $($service.Name) failed to become ready. Aborting."
      Stop-BackendServices
      exit 1
    }
  }

  # Now start api-gateway — all downstreams are confirmed healthy
  $gw = $services | Where-Object { $_.Name -eq "api-gateway" } | Select-Object -First 1
  Start-BackendService $gw

  Write-Host "[runner] all backend services started."

  while ($true) {
    foreach ($entry in $running) {
      Write-NewLogLines $entry.Name $entry.OutLog $false
      Write-NewLogLines $entry.Name $entry.ErrLog $true

      if ($entry.Process.HasExited) {
        Write-Host "[runner] $($entry.Name) exited unexpectedly with code $($entry.Process.ExitCode)."
        Stop-BackendServices
        exit 1
      }
    }

    Start-Sleep -Milliseconds 500
  }
} finally {
  Stop-BackendServices
}
