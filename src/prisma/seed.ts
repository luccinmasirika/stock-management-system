import { PrismaClient } from '@prisma/client';
import * as bycrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function hashPassword(pwd: string) {
  return await bycrypt.hash(pwd, 10);
}

async function main() {
  await prisma.user.upsert({
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

  await prisma.user.upsert({
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

  const categoriesData = [
    {
      name: 'Google Pixel',
      description:
        'Google Pixel is a smartphone developed by Google and released in October 2016.',
    },
    {
      name: 'Samsung Galaxy',
      description:
        'Samsung Galaxy is a series of mobile computing devices designed, manufactured and marketed by Samsung Electronics.',
    },
    {
      name: 'iPhone',
      description:
        "iPhone is a line of smartphones designed and marketed by Apple Inc. They run Apple's iOS mobile operating system.",
    },
    {
      name: 'Huawei',
      description:
        'Huawei is a Chinese multinational technology company headquartered in Shenzhen, Guangdong. ',
    },
    {
      name: 'Xiaomi',
      description:
        'Xiaomi Corporation is a Chinese electronics company headquartered in Beijing.',
    },
    {
      name: 'OnePlus',
      description:
        'OnePlus is a Chinese smartphone manufacturer which operates globally. The company was founded in December 2013 by former Oppo vice president Pete Lau and Carl Pei.',
    },
    {
      name: 'Oppo',
      description: 'Oppo Electronics Corp., commonly referred to as Oppo',
    },
    {
      name: 'Techno',
      description:
        'Techno is a Chinese smartphone manufacturer which operates globally.',
    },
    {
      name: 'Infinix',
      description:
        'Infinix is a Chinese smartphone manufacturer which operates globally.',
    },
  ];

  const phonesData = [
    {
      categoryId: 'Google Pixel',
      name: 'Google Pixel 6',
      description:
        'Google Pixel 6 is a flagship smartphone developed by Google and released in October 2022.',
      purchasedPrice: 800,
      sellingPrice: 1000,
      stock: 8,
    },
    {
      categoryId: 'Samsung Galaxy',
      name: 'Samsung Galaxy S21',
      description:
        'Samsung Galaxy S21 is a flagship smartphone developed by Samsung and released in January 2021.',
      purchasedPrice: 900,
      sellingPrice: 1100,
      stock: 12,
    },
    {
      categoryId: 'iPhone',
      name: 'Apple iPhone 12',
      description:
        'Apple iPhone 12 is a premium smartphone developed by Apple Inc. and released in October 2020.',
      purchasedPrice: 700,
      sellingPrice: 950,
      stock: 15,
    },
    {
      categoryId: 'Huawei',
      name: 'Huawei P40 Pro',
      description:
        'Huawei P40 Pro is a flagship smartphone developed by Huawei and released in March 2020.',
      purchasedPrice: 800,
      sellingPrice: 1000,
      stock: 5,
    },
    {
      categoryId: 'Xiaomi',
      name: 'Xiaomi Mi 11',
      description:
        'Xiaomi Mi 11 is a flagship smartphone developed by Xiaomi and released in December 2020.',
      purchasedPrice: 700,
      sellingPrice: 900,
      stock: 20,
    },
    {
      categoryId: 'OnePlus',
      name: 'OnePlus 9 Pro',
      description:
        'OnePlus 9 Pro is a flagship smartphone developed by OnePlus and released in March 2021.',
      purchasedPrice: 800,
      sellingPrice: 1000,
      stock: 10,
    },
    {
      categoryId: 'Oppo',
      name: 'Oppo Find X3 Pro',
      description:
        'Oppo Find X3 Pro is a flagship smartphone developed by Oppo and released in March 2021.',
      purchasedPrice: 750,
      sellingPrice: 950,
      stock: 6,
    },
    {
      categoryId: 'Techno',
      name: 'Tecno Camon 17 Pro',
      description:
        'Tecno Camon 17 Pro is a mid-range smartphone developed by Tecno and released in May 2021.',
      purchasedPrice: 300,
      sellingPrice: 400,
      stock: 18,
    },
    {
      categoryId: 'Infinix',
      name: 'Infinix Note 11 Pro',
      description:
        'Infinix Note 11 Pro is a mid-range smartphone developed by Infinix and released in November 2021.',
      purchasedPrice: 250,
      sellingPrice: 350,
      stock: 10,
    },
  ];

  await prisma.category.createMany({
    data: categoriesData,
    skipDuplicates: true,
  });

  const categoriesId = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  const phoneCategories = phonesData.map((phone) => {
    const category = categoriesId.find(
      (category) => category.name === phone.categoryId,
    );
    return {
      ...phone,
      categoryId: category.id,
    };
  });

  await prisma.product.createMany({
    data: phoneCategories,
  });

  console.log('Data seeded successfully');
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
