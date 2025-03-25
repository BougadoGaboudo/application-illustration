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
      { format: "A5", type: "scroll", amount: 17.5 },
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
      {
        title: "Ganyu from Genshin Impact",
        url: "/img/ganyu.jpg",
        type: "fanart",
      },
      {
        title: "Kamisato Ayaka from Genshin Impact",
        url: "/img/ayaka.jpg",
        type: "fanart",
      },
      {
        title: "Study Woman",
        url: "/img/studyfemme1.jpg",
        type: "study",
      },
      {
        title: "Yae Miko from Genshin Impact",
        url: "/img/yaefanart.jpg",
        type: "fanart",
      },
      {
        title: "Study Urban Landscape",
        url: "/img/studypaysage4.jpg",
        type: "study",
      },
      {
        title: "Happy New Year 2024",
        url: "/img/hny2024.jpg",
        type: "original",
      },
      {
        title: "Merry Christmas 2023",
        url: "/img/noel2023.jpg",
        type: "original",
      },
      {
        title: "Study Woman",
        url: "/img/studyfemme2.jpg",
        type: "study",
      },
      {
        title: "Study Bunny",
        url: "/img/studylapin.jpg",
        type: "study",
      },
      {
        title: "Raiden Shogun from Genshin Impact",
        url: "/img/raidenfanart.jpg",
        type: "fanart",
      },
      {
        title: "Study Shark",
        url: "/img/studyrequin.jpg",
        type: "study",
      },
      {
        title: "Happy New Year 2022",
        url: "/img/hny2022.jpg",
        type: "original",
      },

      {
        title: "Merry Christmas 2020",
        url: "/img/noel2020.jpg",
        type: "original",
      },
      {
        title: "Study Bird",
        url: "/img/studypiaf.jpg",
        type: "study",
      },
      {
        title: "Study Man",
        url: "/img/studyhomme2.jpg",
        type: "study",
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

  // Création des tags
  const tags = await prisma.$transaction(
    [
      "genshin impact",
      "landscape",
      "holiday",
      "christmas",
      "new year",
      "dragon",
      "animal",
      "character",
      "female",
      "male",
      "nature",
      "colorful",
      "anime",
      "game",
      "study",
      "bunny",
      "bird",
      "shark",
      "urban",
    ].map((tagName) =>
      prisma.tag.create({
        data: { name: tagName },
      })
    )
  );

  // Association des tags avec les illustrations
  // Création d'un Map pour faciliter l'accès aux tags
  const tagMap = tags.reduce((map, tag) => {
    map[tag.name] = tag.id;
    return map;
  }, {});

  // Récupérer toutes les illustrations
  const illustrations = await prisma.illustration.findMany();

  // Associer les tags aux illustrations
  const tagAssociations = [
    {
      title: "OC Dragon",
      tags: ["dragon", "character", "original", "colorful"],
    },

    {
      title: "Happy New Year 2025",
      tags: ["holiday", "new year", "colorful", "character", "female"],
    },
    {
      title: "Happy New Year 2024",
      tags: ["holiday", "new year", "colorful", "character", "female"],
    },
    {
      title: "Happy New Year 2022",
      tags: ["holiday", "new year", "colorful", "character", "female"],
    },

    {
      title: "Merry Christmas 2024",
      tags: ["holiday", "christmas", "colorful"],
    },
    {
      title: "Merry Christmas 2023",
      tags: ["holiday", "christmas", "colorful"],
    },
    {
      title: "Merry Christmas 2020",
      tags: ["holiday", "christmas", "colorful"],
    },

    {
      title: "Yelan from Genshin Impact",
      tags: ["genshin impact", "game", "anime", "female", "character"],
    },
    {
      title: "Ganyu from Genshin Impact",
      tags: ["genshin impact", "game", "anime", "female", "character"],
    },
    {
      title: "Kamisato Ayaka from Genshin Impact",
      tags: ["genshin impact", "game", "anime", "female", "character"],
    },
    {
      title: "Yae Miko from Genshin Impact",
      tags: ["genshin impact", "game", "anime", "female", "character"],
    },
    {
      title: "Raiden Shogun from Genshin Impact",
      tags: ["genshin impact", "game", "anime", "female", "character"],
    },

    { title: "Study Woman", tags: ["study", "female", "character"] },
    { title: "Study Man", tags: ["study", "male", "character"] },
    { title: "Study Urban Landscape", tags: ["study", "landscape", "urban"] },
    { title: "Study Bunny", tags: ["study", "animal", "bunny"] },
    { title: "Study Shark", tags: ["study", "animal", "shark"] },
    { title: "Study Bird", tags: ["study", "animal", "bird"] },
  ];

  // Création des associations
  for (const association of tagAssociations) {
    const illustration = illustrations.find(
      (illus) => illus.title === association.title
    );
    if (illustration) {
      for (const tagName of association.tags) {
        if (tagMap[tagName]) {
          await prisma.illustrationTag.create({
            data: {
              illustration: { connect: { id: illustration.id } },
              tag: { connect: { id: tagMap[tagName] } },
            },
          });
        }
      }
    }
  }
}
main()
  .then(() => console.log("Seeding completed!"))
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
