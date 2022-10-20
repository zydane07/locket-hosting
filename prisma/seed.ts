import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateID } from 'src/helper/vegenerate';
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Admin',
    },
  });

  const event_organizer = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Event_Organizer',
    },
  });

  const participant = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Participant',
    },
  });

  const defaultImage = await prisma.image.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      public_id: 'locket/participant/apo0k9fwnqsxvoymvjcv',
      width: 360,
      height: 360,
      version: 1666263623,
      format: 'jpg',
      etag: '11f4fe67def047f169d89e91be3fac62',
      url: 'http://res.cloudinary.com/dz1q2dbty/image/upload/v1666263623/locket/participant/apo0k9fwnqsxvoymvjcv.jpg',
      secure_url:
        'https://res.cloudinary.com/dz1q2dbty/image/upload/v1666263623/locket/participant/apo0k9fwnqsxvoymvjcv.jpg',
      signature: '2a930900b63ca3f9f6efbd3aba99eba89a7d01e6',
    },
  });

  const categoryLomba = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Lomba',
      description: 'Ini Lomba',
    },
  });

  const categoryEvent = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 1,
      name: 'Event',
      description: 'Ini Event',
    },
  });
  const unix = Math.floor(Date.now() / 1000);
  const random = Math.floor(Math.random() * 100);
  const ID = unix + random;
  const hashPassword = await bcrypt.hash(
    'akusuperadmin',
    Number(process.env.SALT),
  );
  const user_admin = await prisma.user.upsert({
    where: { id: ID },
    update: {},
    create: {
      id: ID,
      email: 'superadmin@gmail.com',
      name: 'SuperAdmin',
      password: hashPassword,
      role_id: 1,
    },
  });
  const hashPassword2 = await bcrypt.hash(
    'vimaveja123',
    Number(process.env.SALT),
  );
  const user_eo = await prisma.user.upsert({
    where: { id: ID + 10 },
    update: {},
    create: {
      id: ID + 10,
      email: 'vimaveja@gmail.com',
      name: 'Vimaveja',
      password: hashPassword2,
      role_id: 2,
    },
  });
  const unix2 = Math.floor(Date.now() / 1000);
  const random2 = Math.floor(Math.random() * 100);
  const ID2 = unix2 + random2;
  const eo = await prisma.event_Organizer.upsert({
    where: { id: ID2 },
    update: {},
    create: {
      id: ID2,
      user_id: user_eo.id,
      is_verified: true,
    },
  });
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
