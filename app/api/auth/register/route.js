import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email et mot de passe requis." }),
      { status: 400 }
    );
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return new Response(
      JSON.stringify({ error: "Cet email est déjà utilisé." }),
      { status: 400 }
    );
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur avec le rôle "client" par défaut
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "client", // Le rôle est maintenant défini côté serveur, et est toujours "client"
    },
  });

  return new Response(
    JSON.stringify({ message: "Utilisateur créé avec succès." }),
    { status: 201 }
  );
}
