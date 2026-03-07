$Env:POSTGRES_USER="tc_admin"
$Env:POSTGRES_DB="tienditacampus"

Write-Host "Tearing down docker containers and volumes..."
docker compose down -v

Write-Host "Starting docker containers..."
docker compose up -d

Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 10
# Wait loop for postgres readiness
$max_attempts = 30
$attempt = 1
while ($attempt -le $max_attempts) {
    $result = docker exec tc-database pg_isready -U tc_admin -d tienditacampus 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Database is ready!"
        break
    }
    Write-Host "Waiting for DB... (Attempt $attempt/$max_attempts)"
    Start-Sleep -Seconds 2
    $attempt++
}

if ($attempt -gt $max_attempts) {
    Write-Host "Failed to connect to database in time."
    exit 1
}

# Wait for flyway migrator to finish (which can take a few seconds after the DB is ready)
Write-Host "Waiting for flyway migrations to finish..."
Start-Sleep -Seconds 15

Write-Host "Running production seeds..."
Get-ChildItem -Path "database\seeds" -Filter "*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "Running $($_.Name)..."
    Get-Content $_.FullName | docker exec -i tc-database psql -U tc_admin -d tienditacampus -f -
}

Write-Host "Running dev seeds..."
Get-ChildItem -Path "database\seeds\dev" -Filter "*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "Running $($_.Name)..."
    Get-Content $_.FullName | docker exec -i tc-database psql -U tc_admin -d tienditacampus -f -
}

Write-Host "Done setting up the database from scratch."
