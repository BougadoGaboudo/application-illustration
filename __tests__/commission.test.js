jest.mock('../lib/prisma', () => ({
  prisma: {
    commissionPrice: {
      findUnique: jest.fn()
    },
    commission: {
      create: jest.fn()
    }
  }
}));

jest.mock('../lib/auth', () => ({
  checkAuth: jest.fn()
}));

const { prisma } = require('../lib/prisma');
const { checkAuth } = require('../lib/auth');
const { createCommission } = require('../lib/commission.action');

test('createCommission crée une commission', async () => {
  checkAuth.mockResolvedValue({ id: 1 });
  prisma.commissionPrice.findUnique.mockResolvedValue({ id: 1, baseAmount: 50 });
  prisma.commission.create.mockResolvedValue({ id: 1 });
  
  const formData = {
    get: (key) => {
      if (key === 'title') return 'Test';
      if (key === 'type') return 'portrait';
      if (key === 'background') return 'false';
      if (key === 'description') return 'Test desc';
      return null;
    }
  };
  
  const result = await createCommission(formData);
  expect(result.success).toBe(true);
});