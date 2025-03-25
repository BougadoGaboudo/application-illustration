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

// Récupérer les tags les plus utilisés
export async function getPopularTags(limit = 10) {
  try {
    // Compter les utilisations des tags dans les commissions et illustrations
    const illustrationTagCounts = await prisma.illustrationTag.groupBy({
      by: ["tagId"],
      _count: {
        tagId: true,
      },
    });

    const commissionTagCounts = await prisma.commissionTag.groupBy({
      by: ["tagId"],
      _count: {
        tagId: true,
      },
    });

    // Fusionner les comptages
    const tagCounts = new Map();

    illustrationTagCounts.forEach((item) => {
      tagCounts.set(
        item.tagId,
        (tagCounts.get(item.tagId) || 0) + item._count.tagId
      );
    });

    commissionTagCounts.forEach((item) => {
      tagCounts.set(
        item.tagId,
        (tagCounts.get(item.tagId) || 0) + item._count.tagId
      );
    });

    // Convertir en tableau et trier
    const sortedTagIds = [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry) => entry[0]);

    // Récupérer les informations des tags
    const popularTags = await prisma.tag.findMany({
      where: {
        id: {
          in: sortedTagIds,
        },
      },
    });

    return popularTags;
  } catch (error) {
    console.error("Erreur lors de la récupération des tags populaires:", error);
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
