const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Conectando a SQL Server Express...');
  await prisma.$connect();
  console.log('¡Conexión exitosa a la base de datos SICA_MAGA!');
}

main()
  .catch((e) => {
    console.error('Error al conectar:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });