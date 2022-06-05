import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import modules from './data/modules.data.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { username: 'administrator' },
    update: {},
    create: {
      username: 'administrator',
      name: 'Administrator',
      password: await argon2.hash('12345678'),
      roles: {
        create: {
          name: 'Superadmin',
        },
      },
    },
  });

  for (const module in modules) {
    for (let i = 0; i < modules[module].length; i++) {
      await prisma.permission.upsert({
        where: {
          name_module: {
            name: modules[module][i],
            module: module,
          },
        },
        update: {
          name: modules[module][i],
          module: module,
        },
        create: {
          name: modules[module][i],
          module: module,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
