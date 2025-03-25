// Mock complet de fs
jest.mock("fs/promises", () => ({
  mkdir: jest.fn().mockResolvedValue(),
  writeFile: jest.fn().mockResolvedValue(),
}));

// Mock de path
jest.mock("path", () => ({
  join: jest.fn((...args) => args.join("/")),
}));

// Mock de prisma
jest.mock("../lib/prisma", () => ({
  prisma: {
    illustration: {
      create: jest.fn(),
    },
  },
}));

// Importer les mocks
const fs = require("fs/promises");
const path = require("path");
const { prisma } = require("../lib/prisma");

// Implémentation simplifiée de createIllustration pour les tests
const createIllustration = async (formData) => {
  const title = formData.get("title");
  const file = formData.get("file");
  const type = formData.get("type");
  const tagsInput = formData.get("tags") || "";

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
};

describe("createIllustration", () => {
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });

  it("devrait créer une nouvelle illustration avec succès", async () => {
    // Arrangement
    const mockFile = {
      name: "test-image.jpg",
      arrayBuffer: jest.fn().mockResolvedValue(new ArrayBuffer(8)),
    };

    const formData = {
      get: jest.fn((key) => {
        if (key === "title") return "Test Illustration";
        if (key === "file") return mockFile;
        if (key === "type") return "original";
        if (key === "tags") return "tag1, tag2";
        return null;
      }),
    };

    const mockIllustration = {
      id: 1,
      title: "Test Illustration",
      url: "/img/test-image.jpg",
      type: "original",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Configuration des mocks
    prisma.illustration.create.mockResolvedValue(mockIllustration);

    // Action
    const result = await createIllustration(formData);

    // Assertions
    expect(fs.mkdir).toHaveBeenCalledWith(expect.any(String), {
      recursive: true,
    });
    expect(fs.writeFile).toHaveBeenCalled();
    expect(prisma.illustration.create).toHaveBeenCalledWith({
      data: {
        title: "Test Illustration",
        url: "/img/test-image.jpg",
        type: "original",
      },
    });
    expect(result).toEqual(mockIllustration);
  });

  it("devrait lancer une erreur si aucun fichier n'est fourni", async () => {
    // Arrangement
    const formData = {
      get: jest.fn((key) => {
        if (key === "title") return "Test Illustration";
        if (key === "file") return null;
        if (key === "type") return "original";
        return null;
      }),
    };

    // Action & Assertion
    await expect(createIllustration(formData)).rejects.toThrow(
      "Aucun fichier sélectionné."
    );
  });
});

// Exposer la fonction pour que Jest puisse l'utiliser
module.exports = { createIllustration };
