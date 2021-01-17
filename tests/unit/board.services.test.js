import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { insertMany, findByTokenId, findByIdAndUpdate, findById } from '../../src/services/board.service';
import mongoose from 'mongoose';
import { mockRooms } from '../mocks/mockRooms';

const expect = chai.expect;
chai.use(sinonChai);

describe('boardServices', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('insertMany', () => {
    it('insertMany calls Board.insertMany ', () => {
      const insertManyStub = sinon.stub(mongoose.Model, 'insertMany');
      insertMany(mockRooms);

      expect(insertManyStub).to.have.been.calledOnce;
      expect(insertManyStub).to.have.been.calledWith(mockRooms);
      expect(insertManyStub).not.to.have.been.calledWith(mockRooms[0]);
    });
  });

  describe('findById', () => {
    it('findById calls Board.findById ', () => {
      const findByIdStub = sinon.stub(mongoose.Model, 'findById');
      findById(1234);

      expect(findByIdStub).to.have.been.calledOnce;
      expect(findByIdStub).to.have.been.calledWith(1234);
      expect(findByIdStub).not.to.have.been.calledWith(123);
    });
  });

  describe('findByIdAndUpdate', () => {
    it('findByIdAndUpdate calls Board.findByIdAndUpdate ', () => {
      const findByIdAndUpdateStub = sinon.stub(mongoose.Model, 'findByIdAndUpdate');
      findByIdAndUpdate(1234);

      expect(findByIdAndUpdateStub).to.have.been.calledOnce;
      expect(findByIdAndUpdateStub).to.have.been.calledWith(1234);
      expect(findByIdAndUpdateStub).not.to.have.been.calledWith(123);
    });
  });

  describe('findByTokenId', () => {
    it('findByTokenId calls Board.find ', () => {
      const findStub = sinon.stub(mongoose.Model, 'find');
      findByTokenId(1234);

      expect(findStub).to.have.been.calledOnce;
      expect(findStub).to.have.been.calledWith({ tokenId: 1234 });
      expect(findStub).not.to.have.been.calledWith({ tokenId: 123 });
    });
  });
});
