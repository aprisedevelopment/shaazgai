const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const banners = [
    { title: 'Featured Products', image: 'featured.png', holboos: '1', cat: 3, publish: 1 },
    { title: 'Discounted Sale', image: 'discount.png', holboos: '2', cat: 3, publish: 1 },
    { title: 'New Arrivals', image: 'new.png', holboos: '3', cat: 3, publish: 1 },
    { title: 'Best Sellers', image: 'best.png', holboos: '4', cat: 3, publish: 1 },
    { title: 'Free Delivery', image: 'delivery.png', holboos: '5', cat: 3, publish: 1 },
  ]

  for (const b of banners) {
    await prisma.banner.create({
      data: b
    })
  }

  console.log('Filter banners seeded!')
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
