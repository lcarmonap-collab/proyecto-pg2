# SICA-MAGA Frontend

Frontend institucional para el Sistema de Información y Control Agrícola del MAGA.

## Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hook Form + Zod
- Leaflet + React-Leaflet
- Recharts (preparado para dashboards)
- JWT + RBAC

## Arquitectura

La aplicación utiliza App Router y una estructura feature-based:

- `app/`: rutas y layouts de Next.js.
- `components/`: componentes reutilizables y layout.
- `features/`: lógica y UI específica de cada módulo.
- `services/`: comunicación con la API REST.
- `schemas/`: validaciones Zod.
- `types/`: contratos TypeScript.
- `providers/`: React Query y autenticación.
- `lib/`: Axios, configuración y utilidades.

## Requisitos

- Node.js LTS
- npm
- Backend SICA-MAGA ejecutándose
- API REST disponible

## Instalación

```bash
npm install
copy .env.example .env.local
```

En PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Configura `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_MAP_DEFAULT_LAT=14.6349
NEXT_PUBLIC_MAP_DEFAULT_LNG=-90.5069
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=7
```

## Ejecutar

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Contrato esperado del backend

### Login

`POST /api/v1/auth/login`

```json
{
  "usuario": "admin",
  "password": "********"
}
```

Respuesta esperada:

```json
{
  "token": "JWT...",
  "usuario": {
    "idUsuario": 1,
    "nombreCompleto": "Administrador",
    "usuario": "admin",
    "rol": "SUPERADMIN",
    "estado": true
  }
}
```

### Productores

```text
GET    /api/v1/productores?page=1&limit=10&search=juan
GET    /api/v1/productores/:id
POST   /api/v1/productores
PUT    /api/v1/productores/:id
DELETE /api/v1/productores/:id
```

La lista espera:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### Parcelas

```text
GET    /api/v1/parcelas
GET    /api/v1/parcelas/:id
POST   /api/v1/parcelas
PUT    /api/v1/parcelas/:id
DELETE /api/v1/parcelas/:id
```

## Seguridad

El starter utiliza `sessionStorage` para conservar el JWT durante la sesión del navegador. Para producción gubernamental se recomienda migrar el token a una cookie `HttpOnly`, `Secure`, `SameSite` y mantener CSRF protection en el backend.

Nunca colocar secretos privados en variables `NEXT_PUBLIC_*`; esas variables son visibles en el navegador.

## Mapa

La vista de parcelas utiliza OpenStreetMap mediante Leaflet. Al hacer clic sobre el mapa se actualizan automáticamente latitud y longitud.

Antes de un despliegue institucional, revisar las políticas de uso/atribución del proveedor de mapas y considerar un proveedor administrado si el volumen lo requiere.
