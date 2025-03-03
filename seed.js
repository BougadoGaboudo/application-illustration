const { prisma } = require("./lib/prisma");

async function main() {

  // Création des formats
  const formats = await prisma.format.createMany({
    data: [
      { name: "scroll" },
      { name: "print" },
    ],
    skipDuplicates: true,
  });

  // Création des tailles
  const sizes = await prisma.size.createMany({
    data: [
      { name: "A4" },
      { name: "A3" },
      { name: "A2" },
    ],
    skipDuplicates: true,
  });

  // Récupération des IDs créés
  const formatScroll = await prisma.format.findUnique({ where: { name: "scroll" } });
  const formatPrint = await prisma.format.findUnique({ where: { name: "print" } });
  
  const sizeA4 = await prisma.size.findUnique({ where: { name: "A4" } });
  const sizeA3 = await prisma.size.findUnique({ where: { name: "A3" } });
  const sizeA2 = await prisma.size.findUnique({ where: { name: "A2" } });

  // Définition des prix par format et taille
  await prisma.formatSizePrice.createMany({
    data: [
      { formatId: formatScroll.id, sizeId: sizeA4.id, price: 20.0 },
      { formatId: formatScroll.id, sizeId: sizeA3.id, price: 25.0 },
      { formatId: formatScroll.id, sizeId: sizeA2.id, price: 35.0 },
      { formatId: formatPrint.id, sizeId: sizeA4.id, price: 15.0 },
      { formatId: formatPrint.id, sizeId: sizeA3.id, price: 20.0 },
      { formatId: formatPrint.id, sizeId: sizeA2.id, price: 30.0 },
    ],
    skipDuplicates: true,
  });

  // Création des illustrations
  await prisma.illustration.createMany({
    data: [
      {
        title: "OC Dragon",
        url: "/img/dragon.jpg",
        type: "original",
        formatId: null, // Sera défini lors de l'achat
        sizeId: null,   // Sera défini lors de l'achat
      },
      {
        title: "Happy New Year 2025",
        url: "/img/hny2025.jpg",
        type: "original",
        formatId: null,
        sizeId: null,
      },
      {
        title: "Merry Christmas 2024",
        url: "/img/noel2024.jpg",
        type: "original",
        formatId: null,
        sizeId: null,
      },
      {
        title: "Yelan from Genshin Impact",
        url: "/img/yelan.jpg",
        type: "fanart",
        formatId: null,
        sizeId: null,
      },
    ],
  });

  // Création des utilisateurs
    await prisma.user.createMany({
      data: [
        {
          email: "admin@admin.com",
          password: "$2b$10$V3DLwIlNZE7/3NPKHUzKu.rJ7xbtzAsqSF48CO5EZryrw/LYD/EIG", // 123
          role: "admin",
        },
        {
          email: "client@client.com",
          password: "$2b$10$V3DLwIlNZE7/3NPKHUzKu.rJ7xbtzAsqSF48CO5EZryrw/LYD/EIG", // 123
          role: "client",
        },
      ],
      skipDuplicates: true,
    });
}

main()
  .then(() => console.log("Seeding completed!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
