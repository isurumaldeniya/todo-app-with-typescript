import { client } from './database/connect';

global.afterAll(async () => {
  await client.close();
});
