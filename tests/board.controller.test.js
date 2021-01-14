import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/index';

chai.use(chaiHttp);
chai.should();

describe('Routes', () => {
  afterEach(() => {
    server.close();
  });

  describe('admin-controller', () => {
    it('should handle correct admin-login', (done) => {
      chai
        .request(server)
        .post('/api/login')
        .send({ username: 'admin', password: '123' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('createBoard', () => {
    it('it should create the correct amount of boards', (done) => {
      chai
        .request(server)
        .post('/api/board')
        .send({ roomNumber: 3, tokenId: 123 })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.lengthOf(3);
          done();
        });
    });
  });

  describe('updateBoard', () => {
    it('should handle correct admin-login', (done) => {
      chai
        .request(server)
        .post('/api/login')
        .send({ username: 'admin', password: '123' })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    describe('saveBoard', () => {
      it('should handle correct admin-login', (done) => {
        chai
          .request(server)
          .post('/api/login')
          .send({ username: 'admin', password: '123' })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('loadBoard', () => {
      it('should handle correct admin-login', (done) => {
        chai
          .request(server)
          .post('/api/login')
          .send({ username: 'admin', password: '123' })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });

    describe('getBoards', () => {
      it('should handle correct admin-login', (done) => {
        chai
          .request(server)
          .post('/api/login')
          .send({ username: 'admin', password: '123' })
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
    });
  });
});
