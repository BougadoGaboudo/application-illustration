'use server'

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'


export async function register(formData) {
  const email = formData.get('email')
  const password = formData.get('password')
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        cart: { create: {} } // Crée automatiquement un panier pour le nouvel utilisateur
      },
    })

    // const token = jwt.sign(
    //   { id: user.id, email: user.email, role: user.role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '24h' }
    // )

    // cookies().set('token', token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 // 24 heures
    // })

    return { success: true }
  } catch (error) {
    return { error: 'Une erreur est survenue lors de l\'inscription' }
  }
}

export async function login(formData) {
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { error: 'Utilisateur non trouvé' }
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return { error: 'Mot de passe incorrect' }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    })

    return { success: true, role: user.role }
  } catch (error) {
    return { error: 'Une erreur est survenue lors de la connexion' }
  }
}

export async function logout() {
  cookies().delete('token')
  return { success: true }
}

export async function updateUser(formData) {
  const token = cookies().get('token')
  if (!token) {
    return { error: 'Non authentifié' }
  }

  const decoded = jwt.verify(token.value, process.env.JWT_SECRET)
  const newEmail = formData.get('email')
  const newPassword = formData.get('password')

  try {
    const updateData = {}
    if (newEmail) updateData.email = newEmail
    if (newPassword) {
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    await prisma.user.update({
      where: { id: decoded.id },
      data: updateData
    })

    return { success: true }
  } catch (error) {
    return { error: 'Une erreur est survenue lors de la mise à jour' }
  }
}