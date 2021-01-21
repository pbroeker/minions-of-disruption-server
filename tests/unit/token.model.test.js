import chai from 'chai';
import mongoose from 'mongoose';
import { mockTokens } from '../mocks/mocks';

const expect = chai.expect;

const tokenSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  language: { type: String, required: true },
  game_version: { type: String, required: true },
  boardIds: [String],
});

const TestToken = mongoose.model('TestToken', tokenSchema);

describe('Token Model', () => {
  before((done) => {
    mongoose.connect('mongodb://localhost/testDatabase');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error'));
    db.once('open', () => {
      console.log('Testdatabase connected');
      done();
    });
  });

  describe('Token queries', () => {
    it('New Token saved to test database', async () => {
      const token1 = new TestToken(mockTokens[0]);
      const token2 = new TestToken(mockTokens[1]);
      const answer1 = await token1.save();
      const answer2 = await token2.save();

      expect(answer1).to.deep.include(mockTokens[0]);
      expect(answer1).to.not.deep.include(mockTokens[1]);
      expect(answer2).to.deep.include(mockTokens[1]);
      expect(answer2).to.not.deep.include(mockTokens[0]);
    });

    it('updates Tokens', async () => {
      const answer = await TestToken.findOneAndUpdate(
        { code: 1234 },
        { $set: { boardIds: ['board3', 'board4'] } },
        { new: true }
      );
      expect(answer).to.deep.include({ ...mockTokens[2], code: 1234 });
      expect(answer).to.not.deep.include(mockTokens[0]);
    });

    it('find all Tokens', async () => {
      const answer = await TestToken.find({});
      expect(answer).to.have.lengthOf(2);
      expect(answer).to.not.have.lengthOf(3);
      const additionalToken = new TestToken(mockTokens[2]);
      await additionalToken.save();
      const newAnswer = await TestToken.find({});
      expect(newAnswer).to.have.lengthOf(3);
      expect(newAnswer).to.not.have.lengthOf(2);
    });

    it(' findOne token by code', async () => {
      const answer = await TestToken.findOne({ code: 9012 });
      expect(answer).to.deep.include(mockTokens[2]);
      expect(answer).to.not.deep.include(mockTokens[0]);
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
});
