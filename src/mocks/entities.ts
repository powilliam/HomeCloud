export const getFolder = () => {
  return {
    accessCode: '123',
  };
};

export const getFile = (accessUrl?: string) => {
  return {
    name: 'test',
    size: 12,
    accessUrl,
    mimetype: 'text/plain',
  };
};
