import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';

chai.use(chaiHttp);
chai.should();

describe('Routes', () => {
  afterEach(() => {
    server.close();
  });

  describe('GET /', () => {
    it('should server the client on /', (done) => {
      chai
        .request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
