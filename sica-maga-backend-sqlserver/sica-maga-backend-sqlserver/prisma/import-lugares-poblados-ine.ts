import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

const LOCAL_JSON = path.resolve(
  process.cwd(),
  'prisma',
  'guatemala-lugares-ine.json'
);

interface Poblado {
  codigo?: string;
  nombre?: string;
  centroide?: {
    longitud?: number;
    latitud?: number;
  };
}

interface MunicipioFuente {
  codigo?: string;
  nombre?: string;
  poblados?: Poblado[];
}

interface DepartamentoFuente {
  codigo?: string;
  nombre?: string;
  municipios?: MunicipioFuente[];
}

function normalizarCodigoMunicipio(value: unknown): string | null {
  const digits = String(value ?? '')
    .replace(/\D/g, '')
    .trim();

  if (!digits) {
    return null;
  }

  return digits.padStart(4, '0');
}

function normalizarTexto(value: unknown): string {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function limitarNombre(value: string): string {
  // Prisma: Comunidad.nombre = VarChar(100)
  return value.slice(0, 100);
}

async function main() {
  console.log('');
  console.log('===================================================');
  console.log(' SICA-MAGA | IMPORTADOR DE LUGARES POBLADOS');
  console.log(' Fuente: espejo GitHub basado en INE Censo 2018');
  console.log('===================================================');
  console.log('');

  try {
    await fs.access(LOCAL_JSON);
  } catch {
    throw new Error(
      `No existe el archivo de datos: ${LOCAL_JSON}. ` +
      'Ejecute primero APLICAR_IMPORTADOR_GITHUB_INE.ps1.'
    );
  }

  const raw = await fs.readFile(
    LOCAL_JSON,
    'utf8'
  );

  const fuente =
    JSON.parse(raw) as DepartamentoFuente[];

  if (!Array.isArray(fuente) || fuente.length === 0) {
    throw new Error(
      'El JSON de lugares poblados está vacío o no tiene la estructura esperada.'
    );
  }

  const municipiosDb =
    await prisma.municipio.findMany({
      select: {
        id: true,
        codigo: true,
        nombre: true,
        departamento: {
          select: {
            codigo: true,
            nombre: true,
          },
        },
      },
    });

  if (municipiosDb.length < 340) {
    throw new Error(
      `MAGA_DB contiene ${municipiosDb.length} municipios. ` +
      'Se requieren al menos 340 antes de importar lugares poblados.'
    );
  }

  const municipioPorCodigo =
    new Map(
      municipiosDb.map((municipio) => [
        municipio.codigo.padStart(4, '0'),
        municipio,
      ])
    );

  const registros =
    new Map<
      string,
      {
        municipioId: number;
        nombre: string;
      }
    >();

  let departamentosFuente = 0;
  let municipiosFuente = 0;
  let pobladosFuente = 0;
  let municipiosNoEncontrados = 0;
  let nombresVacios = 0;

  for (const departamento of fuente) {
    departamentosFuente += 1;

    for (const municipioFuente of departamento.municipios ?? []) {
      municipiosFuente += 1;

      const codigoMunicipio =
        normalizarCodigoMunicipio(
          municipioFuente.codigo
        );

      if (!codigoMunicipio) {
        municipiosNoEncontrados += 1;
        continue;
      }

      const municipioDb =
        municipioPorCodigo.get(
          codigoMunicipio
        );

      if (!municipioDb) {
        municipiosNoEncontrados += 1;

        console.warn(
          `No se encontró municipio fuente ${municipioFuente.codigo} ` +
          `(${departamento.nombre ?? '?'} / ${municipioFuente.nombre ?? '?'})`
        );

        continue;
      }

      for (const poblado of municipioFuente.poblados ?? []) {
        pobladosFuente += 1;

        const nombre =
          limitarNombre(
            normalizarTexto(
              poblado.nombre
            )
          );

        if (!nombre) {
          nombresVacios += 1;
          continue;
        }

        const key =
          `${municipioDb.id}|${nombre.toLocaleLowerCase('es-GT')}`;

        registros.set(
          key,
          {
            municipioId:
              municipioDb.id,
            nombre,
          }
        );
      }
    }
  }

  console.log(
    `Departamentos fuente: ${departamentosFuente}`
  );
  console.log(
    `Municipios fuente: ${municipiosFuente}`
  );
  console.log(
    `Lugares poblados fuente: ${pobladosFuente}`
  );
  console.log(
    `Municipios no relacionados: ${municipiosNoEncontrados}`
  );
  console.log(
    `Lugares con nombre vacío: ${nombresVacios}`
  );
  console.log(
    `Lugares únicos a sincronizar: ${registros.size}`
  );
  console.log('');

  if (registros.size === 0) {
    throw new Error(
      'No se obtuvo ningún lugar poblado para insertar.'
    );
  }

  const values =
    Array.from(
      registros.values()
    );

  const BATCH_SIZE = 100;
  let completados = 0;

  for (
    let index = 0;
    index < values.length;
    index += BATCH_SIZE
  ) {
    const batch =
      values.slice(
        index,
        index + BATCH_SIZE
      );

    await prisma.$transaction(
      batch.map((item) =>
        prisma.comunidad.upsert({
          where: {
            nombre_municipioId: {
              nombre: item.nombre,
              municipioId:
                item.municipioId,
            },
          },
          update: {},
          create: {
            nombre: item.nombre,
            municipioId:
              item.municipioId,
          },
        })
      )
    );

    completados += batch.length;

    console.log(
      `Sincronizados ${completados}/${values.length}`
    );
  }

  const totalComunidades =
    await prisma.comunidad.count();

  const municipiosConComunidades =
    await prisma.comunidad.groupBy({
      by: ['municipioId'],
    });

  console.log('');
  console.log('==============================================');
  console.log(' IMPORTACIÓN COMPLETADA');
  console.log('==============================================');
  console.log(
    `Municipios MAGA_DB: ${municipiosDb.length}`
  );
  console.log(
    `Municipios con comunidades: ${municipiosConComunidades.length}`
  );
  console.log(
    `Total comunidades/lugares en MAGA_DB: ${totalComunidades}`
  );
  console.log('');
}

main()
  .catch((error) => {
    console.error('');
    console.error(
      'ERROR IMPORTANDO LUGARES POBLADOS'
    );
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
