"use server";

import { prisma } from "./prisma";

export async function getRecentCommissions(limit = 3) {
  try {
    // Récupérer toutes les illustrations finales des commissions complétées
    const finalIllustrations = await prisma.commissionFile.findMany({
      where: {
        type: "finalIllustration",
        commission: {
          status: "completed",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        commission: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
    });

    // Transformer les données pour simplifier l'utilisation côté client
    return finalIllustrations.map((illustration) => ({
      id: illustration.id,
      fileId: illustration.id,
      commissionId: illustration.commissionId,
      title: illustration.commission.title,
      type: illustration.commission.type,
      url: illustration.url,
      fileName: illustration.fileName,
      createdAt: illustration.createdAt,
      tags: illustration.commission.tags.map((t) => ({
        id: t.tag.id,
        name: t.tag.name,
      })),
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des illustrations récentes:",
      error
    );
    return [];
  }
}
