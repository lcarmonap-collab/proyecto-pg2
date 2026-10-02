import { prisma } from '../config/prisma';

async function main() {
  try {
    const result = await prisma.$queryRaw<Array<{ ok: number }>>`SELECT 1 AS ok`;
    console.log('SQL Server: conexión OK');
    console.log('Resultado:', result);
  } catch (error) {
    console.error('SQL Server: conexión FALLIDA');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void main();
