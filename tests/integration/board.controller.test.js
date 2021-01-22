import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import mongoose from 'mongoose';
import { getBoards, createBoards, updateBoard, loadBoard } from '../../src/controllers/server/board.controller';
import { mockRooms } from '../mocks/mocks';

const expect = chai.expect;
chai.use(sinonChai);

describe('Board Controller Integration test', () => {
  let res = {
    send: sinon.stub(),
    status: sinon.stub(),
  };
  let req;

  before((done) => {
    mongoose.connect('mongodb://localhost/testDatabase');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('Testdatabase connected');
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });

  afterEach(() => {
    res.send.reset();
    res.status.reset();
    sinon.restore();
  });

  describe('createBoards', () => {
    it('inserts the correct amount of boards into the database ', async () => {
      req = {
        body: { roomNumber: 3, tokenId: 1234 },
      };
      await createBoards(req, res);
      expect(res.send).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(201);
      expect(res.send.args[0][0]).to.have.lengthOf(3);
      expect(res.send.args[0][0][0]).to.deep.include({
        boardData:
          '{"score":0,"escalation":0,"carbions":3,"climmies":7,"coins":3,"pathwayTokens":[],"shields":[],"initiativeDeck":[],"discardedInitiativeCards":[],"disruptionDeck":[],"discardedDisruptionCards":[],"hotspots":[],"activeSeat":0,"roundCount":1}',
        players: '[]',
        tokenId: 1234,
      });
    });
  });

  describe('updating the boards', () => {
    it('get Boards', async () => {
      req = {
        params: { token: 1234 },
      };

      await getBoards(req, res);
      expect(res.status).to.have.been.calledOnce;
      expect(res.send).to.have.been.calledOnce;
      expect(res.status).to.have.been.calledWith(200);
      expect(res.send.args[0][0]).to.have.lengthOf(3);
    });

    it('updates the board correctly ', async () => {
      req = {
        params: { token: 1234 },
      };
      await getBoards(req, res);
      let boardId = res.send.args[0][0][0]._id;
      req = {
        params: { id: boardId },
        body: {
          players: '[player5, player6]',
          boardData:
            '{"score":0,"escalation":0,"carbions":3,"climmies":7,"coins":3,"pathwayTokens":[],"shields":[],"initiativeDeck":[],"discardedInitiativeCards":[],"disruptionDeck":[],"discardedDisruptionCards":[],"hotspots":[],"activeSeat":0,"roundCount":1}',
        },
      };
      await updateBoard(req, res);

      expect(res.status).to.have.been.calledTwice;
      expect(res.send).to.have.been.calledTwice;
      expect(res.status.secondCall).to.have.been.calledWith(201);
      expect(res.send.args[1]).to.have.lengthOf(1);
      expect(res.send.args[1][0]).to.deep.include({
        players: '[player5, player6]',
        boardData:
          '{"score":0,"escalation":0,"carbions":3,"climmies":7,"coins":3,"pathwayTokens":[],"shields":[],"initiativeDeck":[],"discardedInitiativeCards":[],"disruptionDeck":[],"discardedDisruptionCards":[],"hotspots":[],"activeSeat":0,"roundCount":1}',
      });
    });
  });
});
