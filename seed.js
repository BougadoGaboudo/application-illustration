const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Création des prix de commission
  await prisma.commissionPrice.createMany({
    data: [
      { type: "fullbody", baseAmount: 750, bgAddon: 250 },
      { type: "halfbody", baseAmount: 500, bgAddon: 250 },
      { type: "portrait", baseAmount: 250, bgAddon: 250 },
    ],
    skipDuplicates: true,
  });

  // Définition des prix par format et type
  await prisma.price.createMany({
    data: [
      { format: "A4", type: "print", amount: 15.0 },
      { format: "A5", type: "print", amount: 12.5 },
      { format: "A3", type: "print", amount: 20.0 },
      { format: "A2", type: "print", amount: 25.0 },
      { format: "A4", type: "scroll", amount: 20.0 },
      { format: "A3", type: "scroll", amount: 25.0 },
      { format: "A2", type: "scroll", amount: 30.0 },
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
      },
      {
        title: "Happy New Year 2025",
        url: "/img/hny2025.jpg",
        type: "original",
      },
      {
        title: "Merry Christmas 2024",
        url: "/img/noel2024.jpg",
        type: "original",
      },
      {
        title: "Yelan from Genshin Impact",
        url: "/img/yelan.jpg",
        type: "fanart",
      },
    ],
    skipDuplicates: true,
  });

  // Création des utilisateurs
  await prisma.user.createMany({
    data: [
      {
        email: "admin@admin.com",
        password:
          "$2b$10$V3DLwIlNZE7/3NPKHUzKu.rJ7xbtzAsqSF48CO5EZryrw/LYD/EIG", // 123
        role: "admin",
      },
      {
        email: "client@client.com",
        password:
          "$2b$10$V3DLwIlNZE7/3NPKHUzKu.rJ7xbtzAsqSF48CO5EZryrw/LYD/EIG", // 123
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
