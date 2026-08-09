$path = 'c:/SJKM-Billing-System/SJKM BILLING SYSTEM/server.js'
$lines = Get-Content $path
for ($i=0; $i -lt $lines.Count; $i++) {
  $l = $lines[$i]
  if ($l -match 'settings') {
    $start = [Math]::Max(0, $i-3)
    $end = [Math]::Min($lines.Count-1, $i+8)
    Write-Output "=== lines $($start+1)-$($end+1) ==="
    for ($j=$start; $j -le $end; $j++) {
      Write-Output (($j+1).ToString() + ': ' + $lines[$j])
    }
    Write-Output ""
  }
}
