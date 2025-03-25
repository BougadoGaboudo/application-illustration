"use server";

import { prisma } from "./prisma";

// Récupérer tous les tags disponibles
export async function getAllTags() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return tags;
  } catch (error) {
    console.error("Erreur lors de la récupération des tags:", error);
    return [];
  }
}

// Rechercher des tags par nom (pour l'autocomplétion)
export async function searchTags(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          contains: query.toLowerCase(),
        },
      },
      take: 10,
    });

    return tags;
  } catch (error) {
    console.error("Erreur lors de la recherche de tags:", error);
    return [];
  }
}
