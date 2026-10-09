# Guía de instalación y carga de catálogos — SICA-MAGA

## Objetivo

Esta guía deja un entorno local listo para ejecutar SICA-MAGA con:

- 22 departamentos de Guatemala.
- 340 municipios.
- Lugares poblados / comunidades importados desde el archivo JSON incluido en el repositorio.
- Registro de productores con Departamento → Municipio → Comunidad / lugar poblado.
- Registro de parcelas.
- Backend, Prisma y frontend compilados y verificados.

> Importante: **no subir `.env` al repositorio**. Cada desarrollador debe crear su propio `.env`.

---

## 1. Obtener el proyecto

```powershell
git clone https://github.com/lcarmonap-collab/proyecto-pg2.git
cd proyecto-pg2
git pull origin main
```

Si el repositorio ya existe:

```powershell
cd C:\SICA\proyecto-pg2
git pull origin main
```

---

## 2. Instalar dependencias

Desde la raíz:

```powershell
npm run install:all
```

---

## 3. Levantar SQL Server en Docker

Verificar si el contenedor ya existe:

```powershell
docker ps -a --filter "name=sica-sqlserver"
```

Si ya existe:

```powershell
docker start sica-sqlserver
```

Si no existe, crear uno:

```powershell
docker volume create sica_sql_data

docker run `
  -e "ACCEPT_EULA=Y" `
  -e "MSSQL_SA_PASSWORD=CAMBIAR_POR_PASSWORD_LOCAL_SEGURO" `
  -p 1433:1433 `
  --name sica-sqlserver `
  -v sica_sql_data:/var/opt/mssql `
  -d mcr.microsoft.com/mssql/server:2022-latest
```

La contraseña debe cumplir los requisitos de SQL Server.

---

## 4. Crear el `.env` del backend

```powershell
cd C:\SICA\proyecto-pg2\sica-maga-backend-sqlserver\sica-maga-backend-sqlserver

Copy-Item .env.example .env
notepad .env
```

Configurar al menos:

```env
NODE_ENV=development
PORT=3000

DATABASE_URL="sqlserver://localhost:1433;database=MAGA_DB;user=sa;password=TU_PASSWORD_LOCAL;encrypt=true;trustServerCertificate=true"

JWT_ACCESS_SECRET="CLAVE_LOCAL_DE_AL_MENOS_32_CARACTERES"
JWT_REFRESH_SECRET="OTRA_CLAVE_LOCAL_DE_AL_MENOS_32_CARACTERES"

ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"

CORS_ORIGIN="http://localhost:3001"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

---

## 5. Preparar Prisma y la base de datos

Desde el backend:

```powershell
npx prisma validate
npx prisma generate
npx prisma migrate deploy
npm run seed
```

Si `MAGA_DB` todavía no existe y la configuración local requiere crearla antes, créela en SQL Server y repite las migraciones.

Validar conexión:

```powershell
cd C:\SICA\proyecto-pg2
npm run db:check
```

Debe indicar:

```text
SQL Server: conexión OK
Resultado: [ { ok: 1 } ]
```

---

## 6. Cargar 22 departamentos y 340 municipios

Los archivos están incluidos en:

```text
sica-maga-backend-sqlserver/
  sica-maga-backend-sqlserver/
    prisma/
      catalogos/
        catalogos_gt.sql
        CARGAR_CATALOGOS_GT.ps1
```

Ejecutar:

```powershell
cd C:\SICA\proyecto-pg2\sica-maga-backend-sqlserver\sica-maga-backend-sqlserver\prisma\catalogos

Set-ExecutionPolicy -Scope Process Bypass

.\CARGAR_CATALOGOS_GT.ps1
```

Resultado esperado:

```text
Departamentos: 22
Municipios: 340
```

Comprobación manual:

```powershell
docker exec sica-sqlserver `
  /opt/mssql-tools18/bin/sqlcmd `
  -S localhost `
  -U sa `
  -P "$(docker exec sica-sqlserver printenv MSSQL_SA_PASSWORD)" `
  -C `
  -d MAGA_DB `
  -Q "SELECT COUNT(*) AS Departamentos FROM Departamentos; SELECT COUNT(*) AS Municipios FROM Municipios;"
```

---

## 7. Cargar comunidades / lugares poblados

El repositorio incluye:

```text
prisma/guatemala-lugares-ine.json
prisma/import-lugares-poblados-ine.ts
```

El JSON contiene la estructura de 22 departamentos, 340 municipios y los lugares poblados utilizados por el importador.

Antes de importar, regenerar Prisma para garantizar que el `@@unique([nombre, municipioId])` sea reconocido:

```powershell
cd C:\SICA\proyecto-pg2\sica-maga-backend-sqlserver\sica-maga-backend-sqlserver

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

npx prisma validate
npx prisma generate
npx prisma migrate deploy
```

Luego:

```powershell
npm run catalogos:ine
```

La importación procesará aproximadamente:

```text
Departamentos fuente: 22
Municipios fuente: 340
Lugares poblados fuente: 20036
Lugares únicos a sincronizar: ~19657
```

Los totales finales pueden variar ligeramente por consolidación de nombres repetidos dentro del mismo municipio.

Validar:

```powershell
docker exec sica-sqlserver `
  /opt/mssql-tools18/bin/sqlcmd `
  -S localhost `
  -U sa `
  -P "$(docker exec sica-sqlserver printenv MSSQL_SA_PASSWORD)" `
  -C `
  -d MAGA_DB `
  -Q "SELECT COUNT(*) AS Comunidades FROM Comunidades; SELECT COUNT(DISTINCT municipioId) AS MunicipiosConComunidades FROM Comunidades;"
```

---

## 8. Compilar y verificar todo

Desde la raíz:

```powershell
cd C:\SICA\proyecto-pg2

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

npm run verify
```

Debe finalizar con:

```text
Backend: tsc sin errores
Frontend: Compiled successfully
Linting and checking validity of types
Generating static pages
```

---

## 9. Ejecutar SICA-MAGA

```powershell
cd C:\SICA\proyecto-pg2
npm run dev
```

Servicios:

```text
Backend:  http://localhost:3000
Frontend: http://localhost:3001
```

Abrir:

```text
http://localhost:3001/login
```

---

## 10. Pruebas funcionales

### Productores

Abrir:

```text
http://localhost:3001/productores
```

Validar:

```text
Departamento → 22 opciones
Municipio → depende del departamento
Comunidad / lugar poblado → depende del municipio
```

Ejemplos:

```text
Quiché → San Bartolomé Jocotenango → debe mostrar lugares poblados
Guatemala → Mixco → debe mostrar lugares poblados
Sacatepéquez → Antigua Guatemala → debe mostrar lugares poblados
```

Crear un productor y comprobar que aparece en la tabla.

### Parcelas

Abrir:

```text
http://localhost:3001/parcelas
```

Validar:

```text
Productor
Código de parcela
Departamento
Municipio
Área en hectáreas
Tenencia
Latitud
Longitud
```

Guardar y comprobar que el backend responde correctamente.

---

## 11. Diagnóstico rápido

### `Network Error` en login

Verificar backend:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

Verificar DB:

```powershell
npm run db:check
```

### Prisma no reconoce `nombre_municipioId`

Ejecutar:

```powershell
cd C:\SICA\proyecto-pg2\sica-maga-backend-sqlserver\sica-maga-backend-sqlserver

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

npx prisma validate
npx prisma generate
npx prisma migrate deploy
```

y volver a correr:

```powershell
npm run catalogos:ine
```

### El selector de comunidad aparece vacío

Comprobar datos:

```powershell
docker exec sica-sqlserver `
  /opt/mssql-tools18/bin/sqlcmd `
  -S localhost `
  -U sa `
  -P "$(docker exec sica-sqlserver printenv MSSQL_SA_PASSWORD)" `
  -C `
  -d MAGA_DB `
  -Q "SELECT COUNT(*) AS Comunidades FROM Comunidades; SELECT COUNT(DISTINCT municipioId) AS MunicipiosConComunidades FROM Comunidades;"
```

Si solo aparecen unos pocos registros, volver a ejecutar `npm run catalogos:ine`.

---

## 12. Verificación final

Antes de desarrollar:

```powershell
cd C:\SICA\proyecto-pg2
npm run db:check
npm run verify
npm run dev
```

Estado esperado:

```text
Login ✅
SQL Server ✅
22 departamentos ✅
340 municipios ✅
Comunidades / lugares poblados ✅
Productores ✅
Parcelas ✅
Backend ✅
Frontend ✅
```
