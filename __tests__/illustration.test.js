jest.mock('../lib/prisma', () => ({
  prisma: {
    illustration: {
      create: jest.fn()
    }
  }
}));

jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn().mockResolvedValue(undefined),
    writeFile: jest.fn().mockResolvedValue(undefined)
  },
  existsSync: jest.fn().mockReturnValue(true)
}));

jest.mock('path', () => ({
  join: jest.fn(() => 'test/path')
}));

const { prisma } = require('../lib/prisma');
const { createIllustration } = require('../lib/illustration.action');

test('createIllustration crée une illustration', async () => {
  prisma.illustration.create.mockResolvedValue({ id: 1 });
  
  const mockFile = {
    name: 'test.jpg',
    arrayBuffer: () => Promise.resolve(Buffer.from('test'))
  };
  
  const formData = {
    get: (key) => {
      if (key === 'title') return 'Test';
      if (key === 'file') return mockFile;
      if (key === 'type') return 'digital';
      return '';
    }
  };
  
  const result = await createIllustration(formData);
  expect(result).toEqual({ id: 1 });
});