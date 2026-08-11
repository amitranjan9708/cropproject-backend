const { PrismaClient } = require('./generated/prisma/client');
const prisma = require('./prismaClient'); // Use adapter instance

async function main() {
  const users = await prisma.user.findMany();
  if (users.length > 0) {
    await prisma.user.updateMany({ data: { role: 'ADMIN' } });
    console.log('Updated users to ADMIN');
  } else {
    console.log('No users found');
  }

  const existing = await prisma.product.count();
  if (existing === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Classic Cropped Tee', price: '$35', section: 'TSHIRTS' },
        { name: 'Ribbed Baby Tee', price: '$40', section: 'TSHIRTS' },
        { name: 'Graphic Boxy Crop', price: '$45', section: 'TSHIRTS' },
        { name: 'Seamless Cropped Top', price: '$30', section: 'TSHIRTS' },
        { name: 'Oversized Cropped Button-Up', price: '$65', section: 'SHIRTS' },
        { name: 'Linen Cropped Resort Shirt', price: '$55', section: 'SHIRTS' },
        { name: 'Utility Cropped Shacket', price: '$75', section: 'SHIRTS' },
        { name: 'Satin Wrap Crop Shirt', price: '$60', section: 'SHIRTS' }
      ]
    });
    console.log('Seeded products');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
