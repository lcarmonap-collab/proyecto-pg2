# ITERACIÓN 01 - MANIFIESTO DE CAMBIOS

Commit propuesto:

`chore(testing): prepara entorno local, health DB y verificación base`

Cambios:
- agrega `.gitignore` raíz;
- agrega scripts `install:all`, `verify` y `db:check`;
- agrega validación Prisma al backend;
- agrega `src/scripts/check-db.ts`;
- actualiza `/health` para verificar SQL Server;
- agrega `.env.test.example`;
- documenta preparación local y plan de pruebas.

Nota: `node_modules` ya versionado en el commit inicial seguirá apareciendo hasta retirarlo del índice en una limpieza posterior con `git rm -r --cached`.
