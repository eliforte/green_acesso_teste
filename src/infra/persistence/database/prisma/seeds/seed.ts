import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  const lote1 = await prisma.lote.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      nome: '0017',
      ativo: true,
    },
  });

  const lote2 = await prisma.lote.upsert({
    where: { id: 6 },
    update: {},
    create: {
      id: 6,
      nome: '0018',
      ativo: true,
    },
  });

  const lote3 = await prisma.lote.upsert({
    where: { id: 7 },
    update: {},
    create: {
      id: 7,
      nome: '0019',
      ativo: true,
    },
  });

  console.log('Lotes criados:');
  console.log({ lote1, lote2, lote3 });
  console.log('Seed concluído!');
}

main()
  .catch((e) => {
    console.error('Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  