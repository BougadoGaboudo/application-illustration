"use server";

import { prisma } from "./prisma";
import { promises as fs } from "fs";
import path from "path";

export async function createIllustration(formData) {
  const title = formData.get("title");
  const file = formData.get("file");
  const type = formData.get("type");

  if (!file || !file.name) {
    throw new Error("Aucun fichier sélectionné.");
  }

  const publicDir = path.join(process.cwd(), "public/img");
  const fileName = file.name;
  const filePath = path.join(publicDir, fileName);

  await fs.mkdir(publicDir, { recursive: true });
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const newIllustration = await prisma.illustration.create({
    data: {
      title,
      url: `/img/${fileName}`,
      type,
    },
  });

  return newIllustration;
}

export async function getIllustrations() {
    return await prisma.illustration.findMany();
}
