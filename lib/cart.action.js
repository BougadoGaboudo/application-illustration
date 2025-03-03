"use server"

import { checkAuth } from "./auth"
import { prisma } from "./prisma"

export async function addToCart(formData) {
    const auth = await checkAuth()
    if (!auth) {
      return { error: 'Non authentifié' }
    }
  
    const illustrationId = parseInt(formData.get('id'))
    const formatId = parseInt(formData.get('formatId'))
    const sizeId = parseInt(formData.get('sizeId'))
    const quantity = parseInt(formData.get('quantity'))
  
    // Vérifier si le prix existe pour cette combinaison format/taille
    const pricing = await prisma.formatSizePrice.findUnique({
      where: {
        formatId_sizeId: {
          formatId: formatId,
          sizeId: sizeId
        }
      }
    });

    if (!pricing) {
      return { error: 'Combinaison format/taille non disponible' }
    }
    
    try {
      // Récupère ou crée le panier si nécessaire
      let cart = await prisma.cart.findUnique({
        where: { userId: auth.id }
      })
  
      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: auth.id }
        })
      }
  
      // Ajoute ou met à jour l'item dans le panier
      await prisma.cartItem.upsert({
        where: {
          cartId_illustrationId_formatId_sizeId: {
            cartId: cart.id,
            illustrationId,
            formatId,
            sizeId
          }
        },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          cartId: cart.id,
          illustrationId,
          formatId,
          sizeId,
          quantity,
        }
      })
  
      return { success: true }
    } catch (error) {
      console.error(error);
      return { error: 'Erreur lors de l\'ajout au panier' }
    }
  }
  
  export async function updateCartItem(formData) {
    const auth = await checkAuth()
    if (!auth) {
      return { error: 'Non authentifié' }
    }
  
    const cartItemId = parseInt(formData.get('cartItemId'))
    const quantity = parseInt(formData.get('quantity'))
  
    try {
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
      })
      return { success: true }
    } catch (error) {
      return { error: 'Erreur lors de la mise à jour du panier' }
    }
  }
  
  export async function removeFromCart(formData) {
    const auth = await checkAuth()
    if (!auth) {
      return { error: 'Non authentifié' }
    }
  
    const cartItemId = parseInt(formData.get('cartItemId'))
  
    try {
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      })
      return { success: true }
    } catch (error) {
      return { error: 'Erreur lors de la suppression du panier' }
    }
  }

  export async function getCart(userId) {
    try {
      const cart = await prisma.cart.findUnique({
        where: {userId},
        include: {
          items: {
            include: {
              illustration: {
                select: {
                  title: true,
                  url: true,
                }
              },
              format: {
                select: {
                  name: true,
                }
              },
              size: {
                select: {
                  name: true,
                }
              }
            }
          }
        }
      });

      if (!cart) return null;

      // Récupérer les prix pour chaque élément du panier
      const itemsWithPrices = await Promise.all(
        cart.items.map(async (item) => {
          const pricing = await prisma.formatSizePrice.findUnique({
            where: {
              formatId_sizeId: {
                formatId: item.formatId,
                sizeId: item.sizeId
              }
            }
          });

          return {
            ...item,
            price: pricing ? pricing.price : 0,
          };
        })
      );

      return {
        ...cart,
        items: itemsWithPrices
      };
    } catch (error) {
      console.error(error);
      return { error: 'Erreur lors de la recherche du panier'}
    }
  }

// Nouvelles fonctions pour récupérer les formats et tailles
export async function getFormats() {
  return await prisma.format.findMany();
}

export async function getSizes() {
  return await prisma.size.findMany();
}

export async function getPriceForFormatAndSize(formatId, sizeId) {
  const pricing = await prisma.formatSizePrice.findUnique({
    where: {
      formatId_sizeId: {
        formatId: parseInt(formatId),
        sizeId: parseInt(sizeId)
      }
    }
  });
  
  return pricing ? pricing.price : null;
}