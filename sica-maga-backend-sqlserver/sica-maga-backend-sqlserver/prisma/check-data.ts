import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n========== SICA-MAGA ==========\n');

  console.log('Roles:', await prisma.rol.count());
  console.log('Usuarios:', await prisma.usuario.count());
  console.log('Departamentos:', await prisma.departamento.count());
  console.log('Municipios:', await prisma.municipio.count());
  console.log('Comunidades:', await prisma.comunidad.count());
  console.log('Cultivos:', await prisma.cultivo.count());
  console.log(
    'TiposFertilizantes:',
    await prisma.tipoFertilizante.count()
  );
  console.log('Plagas:', await prisma.plaga.count());
  console.log('Productores:', await prisma.productor.count());
  console.log('Parcelas:', await prisma.parcela.count());
  console.log('Cosechas:', await prisma.cosecha.count());
  console.log(
    'Fertilizaciones:',
    await prisma.fertilizacion.count()
  );
  console.log('Incidencias:', await prisma.incidencia.count());
  console.log('RefreshTokens:', await prisma.refreshToken.count());

  console.log('\n===============================\n');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });