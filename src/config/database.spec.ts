import { createConnections } from 'typeorm';
import { development, production } from './database';

describe('Testinc database connections config', () => {
  it('should create multiple database connections', async () => {
    const connections = await createConnections([development, production]);

    const [developmentConnetion, productionConnection] = connections;

    expect(developmentConnetion.isConnected).toBeTruthy();
    expect(productionConnection.isConnected).toBeTruthy();

    await developmentConnetion.close();
    await productionConnection.close();
  });
});
