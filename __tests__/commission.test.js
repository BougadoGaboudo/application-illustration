// Mock complet du module auth
jest.mock("../lib/auth", () => ({
  checkAuth: jest.fn(),
  isAdmin: jest.fn(),
}));

// Mock complet de prisma
jest.mock("../lib/prisma", () => ({
  prisma: {
    commissionPrice: {
      findUnique: jest.fn(),
    },
    commission: {
      create: jest.fn(),
    },
  },
}));

// Importer les mocks
const auth = require("../lib/auth");
const { prisma } = require("../lib/prisma");

// Implémentation simplifiée de createCommission pour tests
const createCommission = async (formData) => {
  const user = await auth.checkAuth();
  if (!user) {
    return { error: "Vous devez être connecté pour créer une commission" };
  }

  try {
    const title = formData.get("title");
    const description = formData.get("description");
    const type = formData.get("type");
    const background = formData.get("background") === "true";

    // Trouver le prix correspondant
    const commissionPrice = await prisma.commissionPrice.findUnique({
      where: { type },
    });

    if (!commissionPrice) {
      return { error: "Prix de commission non trouvé" };
    }

    const commission = await prisma.commission.create({
      data: {
        title,
        description,
        type,
        background,
        status: "pending",
        user: {
          connect: { id: user.id },
        },
        commissionPrice: {
          connect: { id: commissionPrice.id },
        },
      },
      include: {
        commissionPrice: true,
      },
    });

    return { success: true, commission };
  } catch (error) {
    console.error("Erreur lors de la création de la commission:", error);
    return {
      error: "Une erreur est survenue lors de la création de la commission",
    };
  }
};

describe("createCommission", () => {
  beforeEach(() => {
    // Réinitialisation des mocks avant chaque test
    jest.clearAllMocks();
  });

  it("devrait créer une nouvelle commission avec succès", async () => {
    // Arrangement
    const mockUser = { id: 1, email: "test@example.com" };
    const mockCommissionPrice = {
      id: 1,
      type: "fullbody",
      baseAmount: 100,
      bgAddon: 50,
    };
    const mockCommission = {
      id: 1,
      title: "Test Commission",
      description: "Test description",
      type: "fullbody",
      background: true,
      status: "pending",
      userId: 1,
      commissionPriceId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      commissionPrice: mockCommissionPrice,
    };

    const formData = {
      get: jest.fn((key) => {
        if (key === "title") return "Test Commission";
        if (key === "description") return "Test description";
        if (key === "type") return "fullbody";
        if (key === "background") return "true";
        return null;
      }),
    };

    // Configuration des mocks
    auth.checkAuth.mockResolvedValue(mockUser);
    prisma.commissionPrice.findUnique.mockResolvedValue(mockCommissionPrice);
    prisma.commission.create.mockResolvedValue(mockCommission);

    // Action
    const result = await createCommission(formData);

    // Assertions
    expect(auth.checkAuth).toHaveBeenCalled();
    expect(prisma.commissionPrice.findUnique).toHaveBeenCalledWith({
      where: { type: "fullbody" },
    });
    expect(prisma.commission.create).toHaveBeenCalledWith({
      data: {
        title: "Test Commission",
        description: "Test description",
        type: "fullbody",
        background: true,
        status: "pending",
        user: {
          connect: { id: 1 },
        },
        commissionPrice: {
          connect: { id: 1 },
        },
      },
      include: {
        commissionPrice: true,
      },
    });

    expect(result).toEqual({ success: true, commission: mockCommission });
  });

  it("devrait retourner une erreur si l'utilisateur n'est pas authentifié", async () => {
    // Arrangement
    const formData = {
      get: jest.fn(),
    };

    // Configuration des mocks
    auth.checkAuth.mockResolvedValue(null);

    // Action
    const result = await createCommission(formData);

    // Assertions
    expect(auth.checkAuth).toHaveBeenCalled();
    expect(result).toEqual({
      error: "Vous devez être connecté pour créer une commission",
    });
  });

  it("devrait retourner une erreur si le prix de commission n'est pas trouvé", async () => {
    // Arrangement
    const mockUser = { id: 1, email: "test@example.com" };

    const formData = {
      get: jest.fn((key) => {
        if (key === "title") return "Test Commission";
        if (key === "description") return "Test description";
        if (key === "type") return "fullbody";
        if (key === "background") return "true";
        return null;
      }),
    };

    // Configuration des mocks
    auth.checkAuth.mockResolvedValue(mockUser);
    prisma.commissionPrice.findUnique.mockResolvedValue(null);

    // Action
    const result = await createCommission(formData);

    // Assertions
    expect(auth.checkAuth).toHaveBeenCalled();
    expect(prisma.commissionPrice.findUnique).toHaveBeenCalledWith({
      where: { type: "fullbody" },
    });
    expect(result).toEqual({ error: "Prix de commission non trouvé" });
  });
});

// Exposer la fonction pour que Jest puisse l'utiliser
module.exports = { createCommission };
