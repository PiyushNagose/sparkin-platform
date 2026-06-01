$ErrorActionPreference = "Continue"

$ports = @(4000, 4001, 4002, 4003)
$currentPid = $PID

function Get-BackendPortOwners {
  $pids = New-Object System.Collections.Generic.HashSet[int]
  $details = New-Object System.Collections.Generic.HashSet[string]
  $netstat = netstat -ano

  foreach ($line in $netstat) {
    $parts = ($line.Trim() -split "\s+")

    if ($parts.Length -lt 5 -or $parts[0] -ne "TCP" -or $parts[3] -ne "LISTENING") {
      continue
    }

    $localAddress = $parts[1]
    $portText = $localAddress.Substring($localAddress.LastIndexOf(":") + 1)
    $port = 0
    $ownerPid = 0

    if (-not [int]::TryParse($portText, [ref]$port)) {
      continue
    }

    if (-not $ports.Contains($port)) {
      continue
    }

    if (-not [int]::TryParse($parts[4], [ref]$ownerPid)) {
      continue
    }

    if ($ownerPid -le 0 -or $ownerPid -eq $currentPid) {
      continue
    }

    [void]$pids.Add($ownerPid)
    [void]$details.Add("${port}: ${ownerPid}")
  }

  return [pscustomobject]@{
    Pids = @($pids)
    Details = @($details)
  }
}

$owners = Get-BackendPortOwners

if ($owners.Pids.Count -eq 0) {
  Write-Host "[runner] backend ports are free."
  exit 0
}

Write-Host "[runner] freeing occupied backend ports ($($owners.Details -join '; '))..."

foreach ($ownerPid in $owners.Pids) {
  $taskkillOutput = & taskkill /pid $ownerPid /t /f 2>&1

  if ($LASTEXITCODE -ne 0) {
    Write-Host "[runner] could not stop process ${ownerPid}: $($taskkillOutput -join ' ')"
    Write-Host "[runner] close the terminal that owns the backend port, or run this command from an administrator terminal."
    exit 1
  }
}

Start-Sleep -Seconds 1
$remainingOwners = Get-BackendPortOwners

if ($remainingOwners.Pids.Count -gt 0) {
  Write-Host "[runner] ports are still occupied after cleanup: $($remainingOwners.Details -join '; ')"
  exit 1
}

Write-Host "[runner] backend ports released."
