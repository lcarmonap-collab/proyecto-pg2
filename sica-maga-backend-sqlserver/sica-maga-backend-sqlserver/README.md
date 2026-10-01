# SICA-MAGA Backend

API RESTful institucional para el Sistema de Información y Administración Agrícola de MAGA.

## Stack

- Node.js + TypeScript 5+
- Express.js
- Prisma ORM con `sqlserver`
- Microsoft SQL Server / SSMS
- JWT Access + Refresh Tokens
- bcryptjs
- Zod
- Helmet, CORS, express-rate-limit y Morgan

## 1. Requisitos

- Node.js LTS
- SQL Server Developer/Express o instancia institucional
- SQL Server Management Studio (SSMS)
- Base de datos con permisos para crear tablas/migraciones

## 2. Instalación

```powershell
npm install
```

Crear `.env` a partir de `.env.example`.

Ejemplo para SQL Server Express:

```env
DATABASE_URL="sqlserver://LOCALHOST\\SQLEXPRESS:1433;database=MAGA_DB;user=sa;password=TuPassword123;encrypt=true;trustServerCertificate=true"
```

Si SQL Server usa Windows Authentication, Prisma requiere una cadena compatible con la configuración de tu instancia; valida primero la conexión desde SSMS. No publiques credenciales reales.

## 3. Prisma

Generar el cliente:

```powershell
npx prisma generate
```

Crear y aplicar una migración en desarrollo:

```powershell
npx prisma migrate dev --name init
```

En producción:

```powershell
npx prisma migrate deploy
```

Si `MAGA_DB` ya existe y contiene las tablas del proyecto SICA-MAGA creadas previamente, **no ejecutes `migrate dev` a ciegas**. Primero respalda la BD y evalúa `npx prisma db pull` para introspección; después se debe reconciliar el esquema Prisma con la estructura existente.

## 4. Seed

```powershell
npm run seed
```

Usuario inicial de desarrollo:

- correo: `admin@sica-maga.local`
- contraseña: `CambiarPassword123!`

Cambiar inmediatamente esta contraseña fuera de desarrollo.

## 5. Ejecutar

```powershell
npm run dev
```

API:

`http://localhost:3000`

Health check:

`GET http://localhost:3000/health`

## 6. Endpoints

### Auth

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### Productores

- `GET /api/v1/productores?page=1&limit=20&nombre=Juan`
- `GET /api/v1/productores/:id`
- `POST /api/v1/productores`
- `PUT /api/v1/productores/:id`
- `DELETE /api/v1/productores/:id`

### Parcelas

- `GET /api/v1/parcelas?page=1&limit=20`
- `GET /api/v1/parcelas/:id`
- `POST /api/v1/parcelas`
- `PUT /api/v1/parcelas/:id`
- `DELETE /api/v1/parcelas/:id`

## 7. RBAC

- `SUPERADMIN`: lectura, escritura y eliminación; administración institucional.
- `TECNICO_CAMPO`: lectura, creación y actualización de productores y parcelas.
- `CONSULTOR_AUDITOR`: lectura.

El backend es la autoridad real de autorización. Ocultar botones en el frontend no sustituye `authorizeRoles`.

## 8. Respuesta de error

Formato estándar:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos.",
    "details": {}
  }
}
```

## 9. Ejemplo de login

```json
{
  "correo": "admin@sica-maga.local",
  "password": "CambiarPassword123!"
}
```

Respuesta conceptual:

```json
{
  "success": true,
  "data": {
    "accessToken": "...",
    "refreshToken": "...",
    "usuario": {
      "id": 1,
      "nombreCompleto": "Administrador SICA-MAGA",
      "correo": "admin@sica-maga.local",
      "rol": "SUPERADMIN"
    }
  }
}
```

Para endpoints protegidos:

```http
Authorization: Bearer ACCESS_TOKEN
```

## 10. Integración con el frontend

El frontend Next.js debe apuntar a:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

Flujo:

`Next.js -> Express -> Middleware JWT/RBAC -> Controller -> Service -> Repository -> Prisma -> SQL Server`

## 11. Buenas prácticas de producción

- No usar el usuario `sa` para la aplicación en producción; crear un login SQL con permisos mínimos.
- Usar secretos JWT generados aleatoriamente y almacenados en un gestor de secretos.
- Usar HTTPS/TLS.
- Configurar CORS únicamente con los orígenes institucionales.
- Cambiar el usuario seed y eliminar credenciales de desarrollo.
- Hacer backups y probar restauración.
- Revisar y versionar migraciones.
- Incorporar auditoría transaccional para operaciones sensibles.
- Rotar/revocar refresh tokens.
