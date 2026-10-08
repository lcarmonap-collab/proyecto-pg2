import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('');
  console.log('==========================================');
  console.log('       SEED SICA-MAGA');
  console.log('==========================================');

  // =========================================================
  // 1. ROLES
  // =========================================================

  const roles = [
    {
      nombre: 'SUPERADMIN',
      descripcion: 'Acceso institucional total',
    },
    {
      nombre: 'TECNICO_CAMPO',
      descripcion: 'Registro y actualización de información de campo',
    },
    {
      nombre: 'CONSULTOR_AUDITOR',
      descripcion: 'Consulta de reportes y estadísticas',
    },
  ];

  for (const rol of roles) {
    await prisma.rol.upsert({
      where: {
        nombre: rol.nombre,
      },
      update: {
        descripcion: rol.descripcion,
      },
      create: {
        nombre: rol.nombre,
        descripcion: rol.descripcion,
      },
    });
  }

  // =========================================================
  // 2. USUARIO ADMINISTRADOR
  // =========================================================

  const superAdmin = await prisma.rol.findUniqueOrThrow({
    where: {
      nombre: 'SUPERADMIN',
    },
  });

  const passwordHash = await bcrypt.hash(
    'CambiarPassword123!',
    12
  );

  await prisma.usuario.upsert({
    where: {
      correo: 'admin@sica-maga.local',
    },
    update: {
      nombre: 'Administrador SICA-MAGA',
      rolId: superAdmin.id,
      activo: true,
    },
    create: {
      nombre: 'Administrador SICA-MAGA',
      correo: 'admin@sica-maga.local',
      password: passwordHash,
      rolId: superAdmin.id,
      activo: true,
    },
  });

  // =========================================================
  // 3. DEPARTAMENTOS
  // =========================================================

  const departamentos = [
    { codigo: '01', nombre: 'Guatemala' },
    { codigo: '02', nombre: 'El Progreso' },
    { codigo: '03', nombre: 'Sacatepéquez' },
    { codigo: '04', nombre: 'Chimaltenango' },
    { codigo: '05', nombre: 'Escuintla' },
    { codigo: '06', nombre: 'Santa Rosa' },
    { codigo: '07', nombre: 'Sololá' },
    { codigo: '08', nombre: 'Totonicapán' },
    { codigo: '09', nombre: 'Quetzaltenango' },
    { codigo: '10', nombre: 'Suchitepéquez' },
    { codigo: '11', nombre: 'Retalhuleu' },
    { codigo: '12', nombre: 'San Marcos' },
    { codigo: '13', nombre: 'Huehuetenango' },
    { codigo: '14', nombre: 'Quiché' },
    { codigo: '15', nombre: 'Baja Verapaz' },
    { codigo: '16', nombre: 'Alta Verapaz' },
    { codigo: '17', nombre: 'Petén' },
    { codigo: '18', nombre: 'Izabal' },
    { codigo: '19', nombre: 'Zacapa' },
    { codigo: '20', nombre: 'Chiquimula' },
    { codigo: '21', nombre: 'Jalapa' },
    { codigo: '22', nombre: 'Jutiapa' },
  ];

  for (const departamento of departamentos) {
    await prisma.departamento.upsert({
      where: {
        codigo: departamento.codigo,
      },
      update: {
        nombre: departamento.nombre,
      },
      create: {
        codigo: departamento.codigo,
        nombre: departamento.nombre,
      },
    });
  }

  // =========================================================
  // 4. MUNICIPIOS BASE
  // =========================================================

  const municipios = [
    {
      codigo: '0101',
      nombre: 'Guatemala',
      departamentoCodigo: '01',
    },
    {
      codigo: '0102',
      nombre: 'Santa Catarina Pinula',
      departamentoCodigo: '01',
    },
    {
      codigo: '0103',
      nombre: 'San José Pinula',
      departamentoCodigo: '01',
    },
    {
      codigo: '0301',
      nombre: 'Antigua Guatemala',
      departamentoCodigo: '03',
    },
    {
      codigo: '0302',
      nombre: 'Jocotenango',
      departamentoCodigo: '03',
    },
    {
      codigo: '0303',
      nombre: 'Pastores',
      departamentoCodigo: '03',
    },
    {
      codigo: '0401',
      nombre: 'Chimaltenango',
      departamentoCodigo: '04',
    },
    {
      codigo: '0501',
      nombre: 'Escuintla',
      departamentoCodigo: '05',
    },
    {
      codigo: '0701',
      nombre: 'Sololá',
      departamentoCodigo: '07',
    },
    {
      codigo: '0901',
      nombre: 'Quetzaltenango',
      departamentoCodigo: '09',
    },
  ];

  for (const municipio of municipios) {
    const departamento = await prisma.departamento.findUniqueOrThrow({
      where: {
        codigo: municipio.departamentoCodigo,
      },
    });

    const municipioExistente = await prisma.municipio.findFirst({
      where: {
        codigo: municipio.codigo,
        departamentoId: departamento.id,
      },
    });

    if (municipioExistente) {
      await prisma.municipio.update({
        where: {
          id: municipioExistente.id,
        },
        data: {
          nombre: municipio.nombre,
        },
      });
    } else {
      await prisma.municipio.create({
        data: {
          codigo: municipio.codigo,
          nombre: municipio.nombre,
          departamentoId: departamento.id,
        },
      });
    }
  }

  // =========================================================
  // 5. COMUNIDADES BASE
  // =========================================================

  const comunidades = [
    {
      nombre: 'Centro',
      municipioCodigo: '0101',
      departamentoCodigo: '01',
    },
    {
      nombre: 'Centro',
      municipioCodigo: '0301',
      departamentoCodigo: '03',
    },
    {
      nombre: 'San Felipe de Jesús',
      municipioCodigo: '0301',
      departamentoCodigo: '03',
    },
    {
      nombre: 'Centro',
      municipioCodigo: '0401',
      departamentoCodigo: '04',
    },
    {
      nombre: 'Centro',
      municipioCodigo: '0501',
      departamentoCodigo: '05',
    },
  ];

  for (const comunidad of comunidades) {
    const departamento = await prisma.departamento.findUniqueOrThrow({
      where: {
        codigo: comunidad.departamentoCodigo,
      },
    });

    const municipio = await prisma.municipio.findFirstOrThrow({
      where: {
        codigo: comunidad.municipioCodigo,
        departamentoId: departamento.id,
      },
    });

    const comunidadExistente = await prisma.comunidad.findFirst({
      where: {
        nombre: comunidad.nombre,
        municipioId: municipio.id,
      },
    });

    if (comunidadExistente) {
      await prisma.comunidad.update({
        where: {
          id: comunidadExistente.id,
        },
        data: {
          nombre: comunidad.nombre,
        },
      });
    } else {
      await prisma.comunidad.create({
        data: {
          nombre: comunidad.nombre,
          municipioId: municipio.id,
        },
      });
    }
  }

  // =========================================================
  // 6. CULTIVOS
  // =========================================================

  const cultivos = [
    {
      nombre: 'Maíz',
      descripcion: 'Cultivo de maíz para producción agrícola.',
    },
    {
      nombre: 'Frijol',
      descripcion: 'Cultivo de frijol para producción agrícola.',
    },
    {
      nombre: 'Café',
      descripcion: 'Cultivo de café.',
    },
    {
      nombre: 'Cardamomo',
      descripcion: 'Cultivo de cardamomo.',
    },
    {
      nombre: 'Hortalizas',
      descripcion: 'Producción de hortalizas.',
    },
  ];

  for (const cultivo of cultivos) {
    const cultivoExistente = await prisma.cultivo.findFirst({
      where: {
        nombre: cultivo.nombre,
      },
    });

    if (cultivoExistente) {
      await prisma.cultivo.update({
        where: {
          id: cultivoExistente.id,
        },
        data: {
          descripcion: cultivo.descripcion,
        },
      });
    } else {
      await prisma.cultivo.create({
        data: {
          nombre: cultivo.nombre,
          descripcion: cultivo.descripcion,
        },
      });
    }
  }

  // =========================================================
  // 7. TIPOS DE FERTILIZANTE
  // =========================================================

  const fertilizantes = [
    'Fertilizante nitrogenado',
    'Fertilizante fosfatado',
    'Fertilizante potásico',
    'Fertilizante NPK',
    'Fertilizante orgánico',
  ];

  for (const nombre of fertilizantes) {
    const fertilizanteExistente =
      await prisma.tipoFertilizante.findFirst({
        where: {
          nombre,
        },
      });

    if (!fertilizanteExistente) {
      await prisma.tipoFertilizante.create({
        data: {
          nombre,
        },
      });
    }
  }

  // =========================================================
  // 8. PLAGAS
  // =========================================================

  const plagas = [
    'Gusano cogollero',
    'Mosca blanca',
    'Pulgón',
    'Trips',
    'Broca del café',
    'Roya',
  ];

  for (const nombre of plagas) {
    const plagaExistente = await prisma.plaga.findFirst({
      where: {
        nombre,
      },
    });

    if (!plagaExistente) {
      await prisma.plaga.create({
        data: {
          nombre,
        },
      });
    }
  }

  // =========================================================
  // 9. RESUMEN
  // =========================================================

  console.log('');
  console.log('==========================================');
  console.log('       SEED SICA-MAGA COMPLETADO');
  console.log('==========================================');
  console.log('');
  console.log('Roles: 3');
  console.log('Usuario: admin@sica-maga.local');
  console.log('Password: CambiarPassword123!');
  console.log('Departamentos: 22');
  console.log('Municipios base: 10');
  console.log('Comunidades base: 5');
  console.log('Cultivos: 5');
  console.log('Fertilizantes: 5');
  console.log('Plagas: 6');
  console.log('');
  console.log('Productores: 0');
  console.log('Parcelas: 0');
  console.log('Cosechas: 0');
  console.log('Fertilizaciones: 0');
  console.log('Incidencias: 0');
  console.log('');
}

main()
  .catch((error) => {
    console.error('Error ejecutando el seed:');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  