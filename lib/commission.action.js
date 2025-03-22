"use server"

import { checkAuth, isAdmin } from "./auth";
import { prisma } from "./prisma";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Fonction utilitaire pour enregistrer un fichier
async function saveFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${uuidv4()}-${file.name.replace(/\s/g, '_')}`;
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, fileName);

  // Sauvegarder le fichier
  await writeFile(filePath, buffer);
  
  // Retourner les informations du fichier
  return {
    fileName,
    fileType: file.type,
    fileSize: file.size,
    url: `/uploads/${fileName}` // URL relative pour accéder au fichier
  };
}

// CREATE - Créer une nouvelle commission
export async function createCommission(formData) {
    const user = await checkAuth();
    if (!user) {
        return { error: "Vous devez être connecté pour créer une commission"}
    }

    try {
        const title = formData.get('title');
        const description = formData.get('description');
        const type = formData.get('type');
        const background = formData.get('background') === 'true';

        // Trouver le prix correspondant
        const commissionPrice = await prisma.commissionPrice.findFirst({
            where: {
                type: type,
                background: background
            }
        })

        if (!commissionPrice) {
            return { error: "Prix de commission non trouvé"}
        }

        const commission = await prisma.commission.create({
            data: {
                title,
                description,
                type,
                background,
                status: "pending", // Statut par défaut
                user: {
                    connect: {id: user.id}
                },
                commissionPrice: {
                    connect: { id: commissionPrice.id}
                }
            },
            include: {
                commissionPrice: true
            }
        })

        return { success: true, commission }
    } catch (error) {
        console.error("Erreur lors de la création de la commission:", error)
        return { error: "Une erreur est survenue lors de la création de la commission"}
    }
}

// READ - Récupérer toutes les commissions (admin uniquement)
export async function getAllCommissions() {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { error: "Accès non autorisé" }
  }

  try {
    const commissions = await prisma.commission.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        commissionPrice: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, commissions }
  } catch (error) {
    console.error("Erreur lors de la récupération des commissions:", error)
    return { error: "Une erreur est survenue lors de la récupération des commissions" }
  }
}

// READ - Récupérer une commission par ID
export async function getCommissionById(id) {
  const user = await checkAuth()
  if (!user) {
    return { error: "Non authentifié" }
  }

  try {
    const commission = await prisma.commission.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        commissionPrice: true
      }
    })

    if (!commission) {
      return { error: "Commission non trouvée" }
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    const adminCheck = await isAdmin()
    if (commission.userId !== user.id && !adminCheck) {
      return { error: "Vous n'êtes pas autorisé à voir cette commission" }
    }

    return { success: true, commission }
  } catch (error) {
    console.error("Erreur lors de la récupération de la commission:", error)
    return { error: "Une erreur est survenue lors de la récupération de la commission" }
  }
}

// READ - Récupérer les commissions de l'utilisateur connecté
export async function getUserCommissions() {
  const user = await checkAuth()
  if (!user) {
    return { error: "Non authentifié" }
  }

  try {
    const commissions = await prisma.commission.findMany({
      where: { userId: user.id },
      include: {
        commissionPrice: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return { success: true, commissions }
  } catch (error) {
    console.error("Erreur lors de la récupération des commissions:", error)
    return { error: "Une erreur est survenue lors de la récupération des commissions" }
  }
}

// UPDATE - Mettre à jour le statut d'une commission (admin uniquement)
export async function updateCommissionStatus(id, formData) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { error: "Accès non autorisé" }
  }

  try {
    const commissionId = parseInt(id)
    const status = formData.get('status')
    const rejectionReason = formData.get('rejectionReason')

    // Données à mettre à jour
    const updateData = { status }
    
    // Ajouter la raison du refus uniquement si le statut est rejected
    if (status === 'rejected') {
      updateData.rejectionReason = rejectionReason || null
    } else {
      // Effacer la raison du refus si le statut n'est plus rejected
      updateData.rejectionReason = null
    }

    const updatedCommission = await prisma.commission.update({
      where: { id: commissionId },
      data: updateData,
      include: {
        commissionPrice: true,
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })

    return { success: true, commission: updatedCommission }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error)
    return { error: "Une erreur est survenue lors de la mise à jour du statut" }
  }
}

// UPDATE - Mettre à jour une commission (client)
export async function updateCommission(id, formData) {
  const user = await checkAuth()
  if (!user) {
    return { error: "Non authentifié" }
  }

  try {
    // Vérifier que la commission existe et appartient à l'utilisateur
    const commission = await prisma.commission.findUnique({
      where: { id: parseInt(id) }
    })

    if (!commission) {
      return { error: "Commission non trouvée" }
    }

    // Vérifier que l'utilisateur est le propriétaire ou un admin
    const adminCheck = await isAdmin()
    if (commission.userId !== user.id && !adminCheck) {
      return { error: "Vous n'êtes pas autorisé à modifier cette commission" }
    }

    // Vérifier que la commission est en statut "pending" si c'est le client qui modifie
    if (commission.userId === user.id && !adminCheck && commission.status !== 'pending') {
      return { error: "Vous ne pouvez modifier votre commission que lorsqu'elle est en attente" }
    }

    // Récupérer les données du formulaire
    const title = formData.get('title')
    const description = formData.get('description')
    const type = formData.get('type')
    const background = formData.get('background') === 'true'

    // Si le type ou le background change, mettre à jour le prix
    let commissionPriceId = commission.commissionPriceId
    
    if (type !== commission.type || background !== commission.background) {
      const newPrice = await prisma.commissionPrice.findFirst({
        where: {
          type: type,
          background: background
        }
      })
      
      if (!newPrice) {
        return { error: "Prix de commission non trouvé" }
      }
      
      commissionPriceId = newPrice.id
    }

    // Mettre à jour la commission
    const updatedCommission = await prisma.commission.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        type,
        background,
        commissionPriceId
      },
      include: {
        commissionPrice: true
      }
    })

    return { success: true, commission: updatedCommission }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commission:", error)
    return { error: "Une erreur est survenue lors de la mise à jour de la commission" }
  }
}

// DELETE - Supprimer une commission
export async function deleteCommission(id) {
  const user = await checkAuth()
  if (!user) {
    return { error: "Non authentifié" }
  }

  try {
    // Vérifier que la commission existe et appartient à l'utilisateur
    const commission = await prisma.commission.findUnique({
      where: { id: parseInt(id) }
    })

    if (!commission) {
      return { error: "Commission non trouvée" }
    }

    const adminCheck = await isAdmin()
    if (commission.userId !== user.id && !adminCheck) {
      return { error: "Vous n'êtes pas autorisé à supprimer cette commission" }
    }

    // Supprimer la commission
    await prisma.commission.delete({
      where: { id: parseInt(id) }
    })

    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression de la commission:", error)
    return { error: "Une erreur est survenue lors de la suppression de la commission" }
  }
}

// Récupérer les prix des commissions
export async function getCommissionPrices() {
  try {
    const prices = await prisma.commissionPrice.findMany()
    return { success: true, prices }
  } catch (error) {
    console.error("Erreur lors de la récupération des prix:", error)
    return { error: "Une erreur est survenue lors de la récupération des prix" }
  }
}

// Fonction modifiée pour gérer l'upload de croquis
export async function uploadSketch(id, formData) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { error: "Accès non autorisé" }
  }

  try {
    const commissionId = parseInt(id)
    
    // Récupérer la commission pour vérifier son statut
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId }
    })
    
    if (!commission) {
      return { error: "Commission non trouvée" }
    }
    
    // Vérifier que la commission est bien en cours
    if (commission.status !== 'in_progress') {
      return { error: "Vous ne pouvez envoyer un croquis que pour une commission en cours" }
    }
    
    const sketchFile = formData.get('sketch')
    if (!sketchFile) {
      return { error: "Aucun fichier n'a été envoyé" }
    }
    
    // Sauvegarder le fichier et obtenir ses informations
    const fileInfo = await saveFile(sketchFile)
    
    // Créer le fichier de croquis dans la base de données
    const commissionFile = await prisma.commissionFile.create({
      data: {
        commission: { connect: { id: commissionId } },
        url: fileInfo.url,
        fileName: fileInfo.fileName,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.fileSize,
        type: 'sketch'
      }
    })
    
    // Récupérer la commission mise à jour avec son fichier
    const updatedCommission = await prisma.commission.findUnique({
      where: { id: commissionId },
      include: {
        commissionPrice: true,
        user: {
          select: {
            id: true,
            email: true
          }
        },
        files: true
      }
    })
    
    return { success: true, commission: updatedCommission, file: commissionFile }
  } catch (error) {
    console.error("Erreur lors de l'envoi du croquis:", error)
    return { error: "Une erreur est survenue lors de l'envoi du croquis" }
  }
}

// Fonction modifiée pour gérer l'upload d'illustration finale
export async function uploadFinalIllustration(id, formData) {
  const adminCheck = await isAdmin()
  if (!adminCheck) {
    return { error: "Accès non autorisé" }
  }

  try {
    const commissionId = parseInt(id)
    
    // Récupérer la commission pour vérifier son statut
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId }
    })
    
    if (!commission) {
      return { error: "Commission non trouvée" }
    }
    
    // Vérifier que la commission est bien terminée
    if (commission.status !== 'completed') {
      return { error: "Vous ne pouvez envoyer l'illustration finale que pour une commission terminée" }
    }
    
    const illustrationFile = formData.get('illustration')
    if (!illustrationFile) {
      return { error: "Aucun fichier n'a été envoyé" }
    }
    
    // Sauvegarder le fichier et obtenir ses informations
    const fileInfo = await saveFile(illustrationFile)
    
    // Créer le fichier d'illustration finale dans la base de données
    const commissionFile = await prisma.commissionFile.create({
      data: {
        commission: { connect: { id: commissionId } },
        url: fileInfo.url,
        fileName: fileInfo.fileName,
        fileType: fileInfo.fileType,
        fileSize: fileInfo.fileSize,
        type: 'finalIllustration'
      }
    })
    
    // Récupérer la commission mise à jour avec son fichier
    const updatedCommission = await prisma.commission.findUnique({
      where: { id: commissionId },
      include: {
        commissionPrice: true,
        user: {
          select: {
            id: true,
            email: true
          }
        },
        files: true
      }
    })
    
    return { success: true, commission: updatedCommission, file: commissionFile }
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'illustration finale:", error)
    return { error: "Une erreur est survenue lors de l'envoi de l'illustration finale" }
  }
}

// NOUVELLE FONCTION - Récupérer les fichiers d'une commission
export async function getCommissionFiles(id) {
  const user = await checkAuth()
  if (!user) {
    return { error: "Non authentifié" }
  }

  try {
    const commissionId = parseInt(id)
    
    // Récupérer la commission
    const commission = await prisma.commission.findUnique({
      where: { id: commissionId }
    })
    
    if (!commission) {
      return { error: "Commission non trouvée" }
    }
    
    // Vérifier que l'utilisateur est le propriétaire ou un admin
    const adminCheck = await isAdmin()
    if (commission.userId !== user.id && !adminCheck) {
      return { error: "Vous n'êtes pas autorisé à voir cette commission" }
    }
    
    // Récupérer les fichiers
    const files = await prisma.commissionFile.findMany({
      where: { commissionId }
    })
    
    return { success: true, files }
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers:", error)
    return { error: "Une erreur est survenue lors de la récupération des fichiers" }
  }
}