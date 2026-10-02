# Plan de pruebas SICA-MAGA

## Capas previstas
1. Compilación/TypeScript.
2. Prisma validate/generate.
3. Conectividad SQL Server.
4. Smoke tests.
5. Caja negra HTTP.
6. Caja gris API + verificación en BD.
7. Integración Express -> Service -> Repository -> Prisma -> SQL Server.
8. Contrato frontend/backend.
9. E2E con navegador.
10. Regresión.
11. Seguridad/RBAC.

## Iteración 01
La primera iteración cubre compilación, Prisma, conexión SQL Server y health check.

## Iteración 02
Corregir contrato de autenticación y agregar pruebas de login, `/me`, refresh y logout.

## Iteración 03
Corregir contrato de Productores y agregar pruebas CRUD, caja negra, caja gris e integración.

## Iteración 04
Conectar Parcelas de punta a punta y agregar E2E login -> productor -> parcela.
