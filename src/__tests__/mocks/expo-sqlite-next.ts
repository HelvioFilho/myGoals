const mockUseSQLiteContext = jest.fn().mockReturnValue({
  prepareSync: jest.fn().mockReturnValue({
    executeSync: jest.fn(),
  }),
  getAllSync: jest.fn(),
});

export { mockUseSQLiteContext };
