$f = 'C:\SJKM-Billing-System\SJKM BILLING SYSTEM\server.js'
$lines = Get-Content $f
$pats = 'pathname === "/welcome"|pathname === "/portal"|pathname === "/pay"|pathname === "/apply"|pathname === "/help"|pathname === "/"' 
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match $pats) {
        $t = $lines[$i].Trim()
        if ($t.Length -gt 130) { $t = $t.Substring(0,130) }
        '{0}: {1}' -f ($i + 1), $t
    }
}
