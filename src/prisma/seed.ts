import { PrismaClient } from '@prisma/client';
import * as bycrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function hashPassword(pwd: string) {
  return await bycrypt.hash(pwd, 10);
}

async function main() {
  await prisma.sale.updateMany({
    where: {
      facture: {
        amountDue: {
          gt: 0,
        },
      },
    },
    data: {
      status: 'PENDING',
    },
  });
  const superAdmin = await prisma.user.upsert({
    where: { email: 'Ebenezershop@gmail.com' },
    update: {},
    create: {
      email: 'Ebenezershop@gmail.com',
      firstName: 'Ebenezer',
      lastName: 'Shop',
      password: await hashPassword('EbenShop'),
      role: 'SUPER_ADMIN',
    },
  });

  const developer = await prisma.user.upsert({
    where: { email: 'luccinmasirika@gmail.com' },
    update: {},
    create: {
      email: 'luccinmasirika@gmail.com',
      firstName: 'Luccin',
      lastName: 'Masirika',
      password: await hashPassword('EbenShop'),
      role: 'ADMIN',
    },
  });

  console.log({ superAdmin, developer });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
