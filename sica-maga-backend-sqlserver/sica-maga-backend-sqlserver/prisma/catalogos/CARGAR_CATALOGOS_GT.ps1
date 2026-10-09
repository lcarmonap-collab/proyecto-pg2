param(
    [string]$Container = "sica-sqlserver",
    [string]$Database = "MAGA_DB"
)

$ErrorActionPreference = "Stop"

Write-Host "=== SICA-MAGA | Carga de catálogos geográficos ===" -ForegroundColor Cyan

$running = docker ps --filter "name=$Container" --format "{{.Names}}"
if ($running -ne $Container) {
    Write-Host "El contenedor no está activo. Intentando iniciarlo..." -ForegroundColor Yellow
    docker start $Container | Out-Null
    Start-Sleep -Seconds 4
}

$password = docker exec $Container printenv MSSQL_SA_PASSWORD
if ([string]::IsNullOrWhiteSpace($password)) {
    throw "No fue posible leer MSSQL_SA_PASSWORD del contenedor."
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sqlFile = Join-Path $scriptDir "catalogos_gt.sql"

if (!(Test-Path $sqlFile)) {
    throw "No se encontró $sqlFile"
}

Write-Host "Copiando SQL al contenedor..." -ForegroundColor Cyan
docker cp $sqlFile "${Container}:/tmp/catalogos_gt.sql" | Out-Null

Write-Host "Insertando/actualizando departamentos, municipios y zonas..." -ForegroundColor Cyan
docker exec $Container /opt/mssql-tools18/bin/sqlcmd `
    -S localhost `
    -U sa `
    -P $password `
    -C `
    -d $Database `
    -f 65001 `
    -b `
    -i /tmp/catalogos_gt.sql

if ($LASTEXITCODE -ne 0) {
    throw "La carga SQL falló con código $LASTEXITCODE."
}

Write-Host ""
Write-Host "Probando API local..." -ForegroundColor Cyan

try {
    $deptos = Invoke-RestMethod "http://localhost:3000/api/v1/catalogos/departamentos"
    Write-Host ("API departamentos: {0}" -f $deptos.data.Count) -ForegroundColor Green

    $guatemala = $deptos.data | Where-Object { $_.nombre -eq "Guatemala" } | Select-Object -First 1

    if ($null -ne $guatemala) {
        $municipios = Invoke-RestMethod "http://localhost:3000/api/v1/catalogos/municipios?departamentoId=$($guatemala.id)"
        Write-Host ("API municipios de Guatemala: {0}" -f $municipios.data.Count) -ForegroundColor Green

        $munGuatemala = $municipios.data | Where-Object { $_.nombre -eq "Guatemala" } | Select-Object -First 1

        if ($null -ne $munGuatemala) {
            $comunidades = Invoke-RestMethod "http://localhost:3000/api/v1/catalogos/comunidades?municipioId=$($munGuatemala.id)"
            $zonas = @($comunidades.data | Where-Object { $_.nombre -like "Zona *" })
            Write-Host ("API zonas Ciudad de Guatemala: {0}" -f $zonas.Count) -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "La base quedó cargada, pero no pude probar la API." -ForegroundColor Yellow
    Write-Host "Asegúrate de tener npm run dev ejecutándose y vuelve a probar." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Carga terminada." -ForegroundColor Green
Write-Host "Esperado: 22 departamentos, 340 municipios y 22 zonas de Ciudad de Guatemala." -ForegroundColor Green
