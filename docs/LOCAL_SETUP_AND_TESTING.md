# SICA-MAGA - Iteración 01: preparación local y verificación

## Objetivo
Preparar el proyecto para desarrollo local reproducible con Next.js, Express, Prisma y Microsoft SQL Server.

## Requisitos
- Git
- Node.js 22 LTS o compatible
- npm
- Microsoft SQL Server Developer/Express
- SQL Server Management Studio (SSMS) opcional pero recomendado

## Instalación de dependencias
Desde la raíz del repositorio:

```powershell
npm run install:all
```

## Configuración backend
Copiar:

```powershell
cd sica-maga-backend-sqlserver\sica-maga-backend-sqlserver
Copy-Item .env.example .env
```

Editar `.env` y colocar la contraseña real de SQL Server. Nunca subir `.env`.

## Base de datos
Crear dos bases:
- `MAGA_DB`: desarrollo manual.
- `MAGA_DB_TEST`: pruebas automatizadas.

Validar el esquema Prisma:

```powershell
npx prisma validate
npx prisma generate
```

Para una BD nueva y vacía, aplicar las migraciones existentes:

```powershell
npx prisma migrate deploy
```

Luego cargar datos iniciales:

```powershell
npm run seed
```

## Comprobar SQL Server

```powershell
npm run db:check
```

Debe mostrar `SQL Server: conexión OK`.

## Compilar todo
Desde la raíz:

```powershell
npm run verify
```

Esto ejecuta Prisma validate/generate, compila el backend y genera el build del frontend.

## Ejecutar el sistema

```powershell
npm run dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- Health: http://localhost:3000/health

Con SQL Server operativo `/health` debe indicar `database: UP`.

## Criterio de salida Iteración 01
- `npm run db:check` OK
- `npm run verify` OK
- `/health` HTTP 200 y database UP
- Backend y frontend arrancan juntos
