import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Roles del sistema
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
  ] as const;

  // Crear o actualizar roles
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

  // Buscar el rol SUPERADMIN
  const superAdmin = await prisma.rol.findUniqueOrThrow({
    where: {
      nombre: 'SUPERADMIN',
    },
  });

  // Generar contraseña encriptada
  const passwordHash = await bcrypt.hash(
    'CambiarPassword123!',
    12
  );

  // Crear o actualizar usuario administrador
  await prisma.usuario.upsert({
    where: {
      correo: 'admin@sica-maga.local',
    },

    update: {
      nombre: 'Administrador SICA-MAGA',
      rolId: superAdmin.id,
    },

    create: {
      nombre: 'Administrador SICA-MAGA',
      correo: 'admin@sica-maga.local',
      password: passwordHash,
      rolId: superAdmin.id,
    },
  });

  console.log('');
  console.log('==========================================');
  console.log('       SEED SICA-MAGA COMPLETADO');
  console.log('==========================================');
  console.log('');
  console.log('Usuario: admin@sica-maga.local');
  console.log('Password: CambiarPassword123!');
  console.log('');
  console.log('IMPORTANTE: Cambiar la contraseña antes');
  console.log('de utilizar el sistema en producción.');
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

  