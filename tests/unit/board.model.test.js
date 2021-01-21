import chai from 'chai';
import mongoose from 'mongoose';
import { mockBoards } from '../mocks/mocks';

const expect = chai.expect;

const boardSchema = new mongoose.Schema({
  tokenId: { type: Number, required: true },
  boardData: String,
  name: String,
  players: String,
  id: String,
});

const TestBoard = mongoose.model('TestBoard', boardSchema);

describe('Board Model', () => {
  before((done) => {
    mongoose.connect('mongodb://localhost/testDatabase');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('Testdatabase connected');
      done();
    });
  });

  describe('Board quieries', () => {
    it('New board saved to test database', async () => {
      const newBoard = new TestBoard(mockBoards[0]);
      const answer = await newBoard.save();
      expect(answer).to.deep.include(mockBoards[0]);
      expect(answer).to.not.deep.include(mockBoards[1]);
    });

    it('saves several boards', async () => {
      const answer = await TestBoard.insertMany(mockBoards.slice(1));
      expect(answer).to.have.lengthOf(2);
      expect(answer).to.not.have.lengthOf(3);
    });
    it('finds allBoards', async () => {
      const answer = await TestBoard.find({});
      expect(answer).to.have.lengthOf(3);
      expect(answer).to.not.have.lengthOf(2);
    });

    it(' finds boards by tokenId', async () => {
      const answer = await TestBoard.find({ tokenId: 2 });
      expect(answer).to.have.lengthOf(2);
      expect(answer).to.not.have.lengthOf(3);
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
});
