"use server";

import { revalidatePath } from "next/cache";
import { checkAuth } from "./auth";
import { prisma } from "./prisma";

export async function addToCart(formData) {
  const auth = await checkAuth();
  if (!auth) {
    return { error: "Non authentifié" };
  }

  const illustrationId = parseInt(formData.get("id"));
  const formatId = formData.get("formatId");
  const sizeId = formData.get("sizeId"); // Renommé de sizeId mais correspond à type dans le schéma
  const quantity = parseInt(formData.get("quantity"));

  // Vérifier si le prix existe pour cette combinaison format/type
  const pricing = await prisma.price.findFirst({
    where: {
      format: formatId,
      type: sizeId,
    },
  });

  if (!pricing) {
    return { error: "Combinaison format/type non disponible" };
  }

  try {
    // Récupère ou crée le panier si nécessaire
    let cart = await prisma.cart.findUnique({
      where: { userId: auth.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: auth.id },
      });
    }

    // Ajoute ou met à jour l'item dans le panier
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        illustrationId,
        format: formatId,
        type: sizeId,
      },
    });

    if (existingItem) {
      // Mettre à jour la quantité si l'article existe déjà
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Créer un nouvel article si l'article n'existe pas
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          illustrationId,
          format: formatId,
          type: sizeId,
          quantity,
          priceId: pricing.id,
        },
      });
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de l'ajout au panier" };
  }
}

export async function updateCartItem(formData) {
  const auth = await checkAuth();
  if (!auth) {
    return { error: "Non authentifié" };
  }

  const cartItemId = parseInt(formData.get("cartItemId"));
  const quantity = parseInt(formData.get("quantity"));

  try {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
    revalidatePath("/dashboard/cart");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour du panier" };
  }
}

export async function removeFromCart(formData) {
  const auth = await checkAuth();
  if (!auth) {
    return { error: "Non authentifié" };
  }

  const cartItemId = parseInt(formData.get("cartItemId"));

  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    revalidatePath("/dashboard/cart");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la suppression du panier" };
  }
}

export async function getCart(userId) {
  if (!userId) return null;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            illustration: {
              select: {
                title: true,
                url: true,
              },
            },
            price: {
              select: {
                amount: true,
                type: true,
                format: true,
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    return {
      ...cart,
      items: cart.items.map((item) => ({
        ...item,
        price: item.price.amount, // Ajouter le prix à l'élément du panier
        type: item.price.type, // Ajouter le type (print/scroll)
        format: item.price.format, // Ajouter le format (A5, A4, etc.)
      })),
    };
  } catch (error) {
    console.error(error);
    return { error: "Erreur lors de la recherche du panier" };
  }
}

// Fonction pour récupérer tous les formats disponibles
export async function getFormats() {
  try {
    // Récupérer tous les formats disponibles dans la table Price
    const formats = await prisma.price.findMany({
      select: {
        format: true,
      },
      distinct: ["format"],
    });

    // Convertir les formats en objets avec id et name pour la compatibilité
    return formats.map((f) => ({
      id: f.format,
      name: f.format,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fonction pour récupérer tous les types disponibles
export async function getTypes() {
  try {
    // Récupérer tous les types disponibles dans la table Price
    const types = await prisma.price.findMany({
      select: {
        type: true,
      },
      distinct: ["type"],
    });

    // Convertir les types en objets avec id et name pour la compatibilité
    return types.map((t) => ({
      id: t.type,
      name: t.type === "print" ? "Print" : "Scroll",
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPrice(format, type) {
  if (!format || !type) return null;

  try {
    const pricing = await prisma.price.findFirst({
      where: {
        format: format,
        type: type,
      },
    });

    return pricing ? pricing.amount : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
