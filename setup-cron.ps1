# Script PowerShell para configurar tarea programada de actualización SMN
# Ejecutar como Administrador

param(
    [int]$IntervalMinutes = 15,
    [string]$ProjectPath = $PWD.Path
)

$TaskName = "SMN-WeatherData-AutoUpdate"
$ScriptPath = Join-Path $ProjectPath "auto-updater.js"
$LogPath = Join-Path $ProjectPath "auto-update.log"

Write-Host "🚀 Configurando tarea programada para actualización automática SMN" -ForegroundColor Green
Write-Host "📁 Directorio del proyecto: $ProjectPath"
Write-Host "⏰ Intervalo: cada $IntervalMinutes minutos"
Write-Host "📋 Nombre de tarea: $TaskName"

# Verificar si Node.js está disponible
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Instalar Node.js primero." -ForegroundColor Red
    exit 1
}

# Verificar si el script existe
if (-not (Test-Path $ScriptPath)) {
    Write-Host "❌ Script auto-updater.js no encontrado en: $ScriptPath" -ForegroundColor Red
    exit 1
}

# Eliminar tarea existente si existe
try {
    Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop | Out-Null
    Write-Host "🗑️  Eliminando tarea existente..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
} catch {
    # La tarea no existe, continuar
}

# Crear nueva tarea programada
$Action = New-ScheduledTaskAction -Execute "node" -Argument """$ScriptPath"" $IntervalMinutes" -WorkingDirectory $ProjectPath
$Trigger = New-ScheduledTaskTrigger -AtStartup
$Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5)

# Registrar la tarea
try {
    Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Principal $Principal -Settings $Settings -Description "Actualización automática de datos meteorológicos del SMN cada $IntervalMinutes minutos"
    Write-Host "✅ Tarea programada creada exitosamente" -ForegroundColor Green
    
    # Iniciar la tarea inmediatamente
    Start-ScheduledTask -TaskName $TaskName
    Write-Host "🚀 Tarea iniciada" -ForegroundColor Green
    
    Write-Host "`n📊 INFORMACIÓN DE LA TAREA:" -ForegroundColor Cyan
    Write-Host "Nombre: $TaskName"
    Write-Host "Script: $ScriptPath"
    Write-Host "Intervalo: $IntervalMinutes minutos"
    Write-Host "Log: $LogPath"
    
    Write-Host "`n🔧 COMANDOS ÚTILES:" -ForegroundColor Cyan
    Write-Host "Ver estado: Get-ScheduledTask -TaskName '$TaskName'"
    Write-Host "Iniciar: Start-ScheduledTask -TaskName '$TaskName'"
    Write-Host "Detener: Stop-ScheduledTask -TaskName '$TaskName'"
    Write-Host "Eliminar: Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"
    
} catch {
    Write-Host "❌ Error creando tarea programada: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Configuración completada. Los datos se actualizarán automáticamente cada $IntervalMinutes minutos." -ForegroundColor Green
