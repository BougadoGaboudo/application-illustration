const { prisma } = require("./lib/prisma");

async function main() {
  await prisma.illustration.createMany({
    data: [
      {
        title: "OC Dragon",
        url: "img/dragon.jpg",
        type: "original",
      },
      {
        title: "Happy New Year 2025",
        url: "img/hny2025.jpg",
        type: "original",
      },
      {
        title: "Merry Christmas 2024",
        url: "img/noel2024.jpg",
        type: "original",
      },
      {
        title: "Yelan from Genshin Impact",
        url: "img/yelan.jpg",
        type: "fanart",
      },
    ],
  });

  //   await prisma.user.createMany({
  //     data: [
  //       {
  //         email: "admin@admin.com",
  //         password: "$2b$10$V3DLwIlNZE7/3NPKHUzKu.rJ7xbtzAsqSF48CO5EZryrw/LYD/EIG", // 123
  //         role: "admin",
  //       },
  //       {
  //         email: "client@client.com",
  //         password: "$2b$10$V3DLwIlNZE7/3NPKHUzKu.rJ7xbtzAsqSF48CO5EZryrw/LYD/EIG", // 123
  //         role: "client",
  //       },
  //     ],
  //   });
}

main()
  .then(() => console.log("Seeding completed!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
