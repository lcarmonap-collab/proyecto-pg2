import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT
        t.name AS Tabla,
        i.name AS Indice,
        i.is_unique AS EsUnico,
        STRING_AGG(c.name, ', ')
          WITHIN GROUP (ORDER BY ic.key_ordinal) AS Columnas
    FROM sys.tables t
    INNER JOIN sys.indexes i
        ON t.object_id = i.object_id
    INNER JOIN sys.index_columns ic
        ON i.object_id = ic.object_id
        AND i.index_id = ic.index_id
    INNER JOIN sys.columns c
        ON ic.object_id = c.object_id
        AND ic.column_id = c.column_id
    WHERE t.name IN (
        'Municipios',
        'Comunidades',
        'Cultivos',
        'TiposFertilizantes',
        'Plagas'
    )
    AND i.is_unique = 1
    AND i.is_primary_key = 0
    GROUP BY t.name, i.name, i.is_unique
    ORDER BY t.name, i.name;
  `);

  console.table(result);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });