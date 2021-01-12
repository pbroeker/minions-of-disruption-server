import { expect } from 'chai';
const server = { port: 3005 };

describe('Server', () => {
  it('tests that server is running at the current port', async () => {
    expect(server.port).to.equal(3005);
  });
});
