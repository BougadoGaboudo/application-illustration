import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

export async function checkAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  if (!token) return null

  try {
    return jwt.verify(token.value, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function getUserRole() {
  const user = await checkAuth();
  if (!user) return null;

  try {
    const userData = await prisma.user.findUnique({
      where: {id: user.id},
      select: {role: true}
    });

    return userData?.role || null;

  } catch (error) {
    console.error('Erreur lors de la récupération du rôle', error)
    return null;
  }
}

export async function isAdmin() {
  const role = await getUserRole();
  return role === 'admin';
}