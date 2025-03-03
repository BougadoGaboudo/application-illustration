import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

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