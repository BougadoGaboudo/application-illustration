"use server";

import { prisma } from "./prisma";
import { promises as fs } from "fs";
import path from "path";

// Créer un tag ou récupérer un tag existant
export async function getOrCreateTag(tagName) {
  const tag = await prisma.tag.upsert({
    where: { name: tagName.trim().toLowerCase() },
    update: {},
    create: { name: tagName.trim().toLowerCase() },
  });

  return tag;
}

export async function updateIllustrationTags(illustrationId, tagNames) {
  // Supprimer les tags existants pour cette illustration
  await prisma.illustrationTag.deleteMany({
    where: { illustrationId: parseInt(illustrationId) },
  });

  // Créer un tableau de promesses pour chaque tag
  const tagPromises = tagNames.map(async (tagName) => {
    const tag = await getOrCreateTag(tagName);

    return prisma.illustrationTag.create({
      data: {
        illustration: { connect: { id: parseInt(illustrationId) } },
        tag: { connect: { id: tag.id } },
      },
    });
  });

  // Attendre que toutes les promesses soient résolues
  await Promise.all(tagPromises);

  return { success: true };
}

export async function getIllustrationsByTag(tagName) {
  const illustrations = await prisma.illustration.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: tagName.toLowerCase(),
          },
        },
      },
    },
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return illustrations;
}

export async function createIllustration(formData) {
  const title = formData.get("title");
  const file = formData.get("file");
  const type = formData.get("type");
  const tagsInput = formData.get("tags") || ""; // Tags séparés par des virgules

  if (!file || !file.name) {
    throw new Error("Aucun fichier sélectionné.");
  }

  const publicDir = path.join(process.cwd(), "public/img");
  const fileName = file.name;
  const filePath = path.join(publicDir, fileName);

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const newIllustration = await prisma.illustration.create({
    data: {
      title,
      url: `/img/${fileName}`,
      type,
    },
  });

  // Ajouter les tags si présents
  if (tagsInput.trim()) {
    const tagNames = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    await updateIllustrationTags(newIllustration.id, tagNames);
  }

  return newIllustration;
}

export async function getIllustrations() {
  return await prisma.illustration.findMany({
    include: {
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });
}

export async function getShopIllustrations() {
  return await prisma.illustration.findMany({
    where: {
      type: {
        not: "study",
      },
    },
  });
}
