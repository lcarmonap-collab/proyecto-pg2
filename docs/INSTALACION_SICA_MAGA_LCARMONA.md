# SICA-MAGA — Guía de instalación y ejecución local

**Repositorio:** `lcarmonap-collab/proyecto-pg2`  
**Rama:** `main`  
**Commit base validado:** `b9be574` — `chore(testing): prepara SQL Server local, Prisma y verificacion base`

> Objetivo: dejar funcionando en Windows el flujo **Frontend Next.js → Backend Express → Prisma → SQL Server 2022 en Docker → Login**.

## 1. Requisitos previos

Instalar antes de clonar:

- Git
- Node.js 20 LTS o 22 LTS
- npm
- Docker Desktop
- WSL 2 habilitado para Docker Desktop
- PowerShell

Comprobar:

```powershell
git --version
node --version
npm --version
docker --version
docker compose version
```

Docker Desktop debe estar abierto y ejecutándose.

## 2. Clonar el repositorio

```powershell
cd C:\
git clone https://github.com/lcarmonap-collab/proyecto-pg2.git
cd C:\proyecto-pg2
```

Comprobar rama y actualizar:

```powershell
git branch --show-current
git pull origin main
git --no-pager log --oneline -3
```

Debe aparecer:

```text
b9be574 chore(testing): prepara SQL Server local, Prisma y verificacion base
```

## 3. Instalar dependencias

Desde la raíz:

```powershell
cd C:\proyecto-pg2
npm run install:all
```

Este comando instala dependencias de raíz, backend y frontend.

**No ejecutar:**

```powershell
npm audit fix --force
```

Tampoco actualizar Prisma, Next.js, React ni dependencias mayores por cuenta propia durante esta instalación.

## 4. Revisar el `.env` del backend

Archivo:

```text
sica-maga-backend-sqlserver\sica-maga-backend-sqlserver\.env
```

Debe existir después de clonar el repositorio autorizado. Su estructura debe incluir:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="sqlserver://localhost:1433;database=MAGA_DB;user=sa;password=TU_PASSWORD;encrypt=true;trustServerCertificate=true"
JWT_ACCESS_SECRET="..."
JWT_REFRESH_SECRET="..."
ACCESS_TOKEN_EXPIRES_IN="15m"
REFRESH_TOKEN_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:3001"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

**Importante:** la contraseña usada para crear SQL Server debe ser exactamente la misma que aparece como `password=` dentro de `DATABASE_URL`.

No reemplazar el `.env` funcional por `.env.example` si ya viene configurado.

## 5. Descargar SQL Server 2022

```powershell
docker pull mcr.microsoft.com/mssql/server:2022-latest
docker volume create sica_sql_data
docker volume ls
```

Debe aparecer `sica_sql_data`.

## 6. Crear o iniciar el contenedor

Primero revisar si existe:

```powershell
docker ps -a --filter "name=sica-sqlserver"
```

Si **no existe**, usar la misma contraseña del `.env`:

```powershell
docker run `
  --name sica-sqlserver `
  --hostname sica-sqlserver `
  -e "ACCEPT_EULA=Y" `
  -e "MSSQL_SA_PASSWORD=TU_PASSWORD_DEL_ENV" `
  -p 1433:1433 `
  -v sica_sql_data:/var/opt/mssql `
  -d `
  mcr.microsoft.com/mssql/server:2022-latest
```

Si ya existe pero está detenido:

```powershell
docker start sica-sqlserver
```

Comprobar:

```powershell
docker ps --filter "name=sica-sqlserver"
```

Debe mostrar el puerto `1433` publicado.

## 7. Esperar a que SQL Server esté listo

```powershell
docker logs sica-sqlserver --tail 30
```

Esperar hasta ver:

```text
SQL Server is now ready for client connections
```

No ejecutar migraciones antes de ese punto.

## 8. Crear las bases de datos

El proyecto utiliza:

```text
MAGA_DB
MAGA_DB_TEST
```

Con `sqlcmd` dentro del contenedor:

```powershell
docker exec sica-sqlserver `
  /opt/mssql-tools18/bin/sqlcmd `
  -S localhost `
  -U sa `
  -P "TU_PASSWORD_DEL_ENV" `
  -C `
  -Q "IF DB_ID('MAGA_DB') IS NULL CREATE DATABASE MAGA_DB; IF DB_ID('MAGA_DB_TEST') IS NULL CREATE DATABASE MAGA_DB_TEST;"
```

Verificar:

```powershell
docker exec sica-sqlserver `
  /opt/mssql-tools18/bin/sqlcmd `
  -S localhost `
  -U sa `
  -P "TU_PASSWORD_DEL_ENV" `
  -C `
  -Q "SELECT name,state_desc FROM sys.databases WHERE name IN ('MAGA_DB','MAGA_DB_TEST');"
```

Resultado esperado:

```text
MAGA_DB       ONLINE
MAGA_DB_TEST  ONLINE
```

Si la imagen no encuentra `/opt/mssql-tools18/bin/sqlcmd`, utilizar `sqlcmd` instalado en Windows apuntando a `localhost,1433`.

## 9. Validar Prisma

```powershell
cd C:\proyecto-pg2\sica-maga-backend-sqlserver\sica-maga-backend-sqlserver
npx prisma validate
npx prisma generate
```

Resultados esperados:

```text
The schema at prisma\schema.prisma is valid
Generated Prisma Client
```

## 10. Probar Backend → SQL Server

```powershell
cd C:\proyecto-pg2
npm run db:check
```

Resultado esperado:

```text
SQL Server: conexión OK
Resultado: [ { ok: 1 } ]
```

Si falla, revisar Docker, puerto 1433, contraseña y `DATABASE_URL` antes de continuar.

## 11. Aplicar migraciones

```powershell
cd C:\proyecto-pg2\sica-maga-backend-sqlserver\sica-maga-backend-sqlserver
npx prisma migrate deploy
```

Resultado esperado:

```text
Applying migration `20260925022209_init`
All migrations have been successfully applied.
```

Para una instalación nueva usar `migrate deploy`. No crear una migración nueva solo para instalar el proyecto.

## 12. Ejecutar el seed

```powershell
npm run seed
```

El seed crea los roles:

```text
SUPERADMIN
TECNICO_CAMPO
CONSULTOR_AUDITOR
```

Usuario de desarrollo:

```text
Usuario: admin@sica-maga.local
Password: CambiarPassword123!
```

Estas credenciales son solo para desarrollo.

## 13. Verificar compilación completa

Antes de ejecutar `verify`, asegurarse de que no haya un `npm run dev` abierto.

```powershell
cd C:\proyecto-pg2
npm run verify
```

Este comando ejecuta:

```text
Prisma validate
Prisma generate
Backend TypeScript build
Frontend Next.js build
```

### Si aparece `EPERM ... query_engine-windows.dll.node`

Un proceso Node está bloqueando Prisma.

Cerrar cualquier `npm run dev` con `Ctrl+C` y ejecutar:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

Después:

```powershell
cd C:\proyecto-pg2\sica-maga-backend-sqlserver\sica-maga-backend-sqlserver
npx prisma generate
cd C:\proyecto-pg2
npm run verify
```

## 14. Levantar todo el sistema

Desde la raíz:

```powershell
cd C:\proyecto-pg2
npm run dev
```

Levanta simultáneamente:

```text
Backend  → http://localhost:3000
Frontend → http://localhost:3001
```

No cerrar esa terminal mientras se esté probando el sistema.

## 15. Comprobar Health Check

Abrir:

```text
http://localhost:3000/health
```

Debe indicar servicio y base de datos disponibles.

## 16. Probar Login

Abrir:

```text
http://localhost:3001/login
```

Credenciales locales:

```text
Correo:     admin@sica-maga.local
Contraseña: CambiarPassword123!
```

Flujo esperado:

```text
Login
  ↓
Frontend Next.js
  ↓
POST /api/v1/auth/login
  ↓
Backend Express
  ↓
Prisma
  ↓
SQL Server
  ↓
JWT
  ↓
sessionStorage
  ↓
Dashboard
```

El arreglo del contrato de autenticación ya está incluido en el commit `b9be574`.

## 17. Estado inicial de los datos

Después del seed es normal tener:

```text
Roles        = 3
Usuarios     = 1
Productores  = 0
Parcelas     = 0
Cultivos     = 0
```

Por eso el Dashboard todavía puede mostrar indicadores con `—`. Eso no significa que SQL Server esté fallando.

## 18. Verificar tablas

Opcional:

```powershell
docker exec sica-sqlserver `
  /opt/mssql-tools18/bin/sqlcmd `
  -S localhost `
  -U sa `
  -P "TU_PASSWORD_DEL_ENV" `
  -C `
  -d MAGA_DB `
  -Q "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE='BASE TABLE' ORDER BY TABLE_NAME;"
```

Deben existir, entre otras:

```text
_prisma_migrations
Comunidades
Cosechas
Cultivos
Departamentos
Fertilizaciones
Incidencias
Municipios
Parcelas
Plagas
Productores
RefreshTokens
Roles
TiposFertilizantes
Usuarios
```

## 19. Actualizar el proyecto posteriormente

```powershell
cd C:\proyecto-pg2
git status
git pull origin main
npm run install:all
```

Si existen migraciones nuevas:

```powershell
cd C:\proyecto-pg2\sica-maga-backend-sqlserver\sica-maga-backend-sqlserver
npx prisma generate
npx prisma migrate deploy
```

Después:

```powershell
cd C:\proyecto-pg2
npm run verify
npm run dev
```

## 20. Reglas para no romper el entorno

- No volver a subir `node_modules` a Git.
- No ejecutar `npm audit fix --force`.
- No actualizar Prisma a una versión mayor sin revisar compatibilidad.
- No ejecutar `prisma migrate reset` sobre una base con datos importantes.
- No ejecutar `prisma migrate dev` simplemente para instalar el proyecto.
- No cambiar los puertos 3000/3001 sin actualizar CORS/API URL.
- No cambiar la contraseña del contenedor sin actualizar `DATABASE_URL`.
- No reemplazar el `.env` funcional por `.env.example`.
- Antes de `npm run verify`, detener procesos Node si Prisma presenta `EPERM`.
- Mantener Docker Desktop iniciado mientras se utilice SQL Server.

## Secuencia rápida

```text
1. Instalar Git + Node + Docker Desktop
2. Clonar proyecto
3. npm run install:all
4. docker pull SQL Server
5. crear volumen
6. levantar sica-sqlserver
7. crear MAGA_DB y MAGA_DB_TEST
8. npx prisma validate
9. npx prisma generate
10. npm run db:check
11. npx prisma migrate deploy
12. npm run seed
13. npm run verify
14. npm run dev
15. probar /health
16. probar /login
```

## Diagnóstico rápido

### Docker dice que `sica-sqlserver` ya existe

```powershell
docker start sica-sqlserver
```

### Puerto 1433 no responde

```powershell
docker ps
docker port sica-sqlserver
docker logs sica-sqlserver --tail 50
```

### `db:check` falla

Revisar:

```text
Docker activo
SQL Server listo
MAGA_DB existente
localhost:1433
usuario sa
password del .env
trustServerCertificate=true
```

### Login no funciona

Primero comprobar:

```text
http://localhost:3000/health
```

Después confirmar backend en `3000` y frontend en `3001`.

### Prisma muestra EPERM

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

Luego:

```powershell
npx prisma generate
```

---

**SICA-MAGA — Entorno local de desarrollo**  
**Base técnica validada: commit `b9be574`**
