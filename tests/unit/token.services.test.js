import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { create, update, check, getAll } from '../../src/services/token.services';
import mongoose from 'mongoose';

const expect = chai.expect;
chai.use(sinonChai);

describe('tokenServices', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('create calls Token.create with correct arguments ', () => {
      const createStub = sinon.stub(mongoose.Model, 'create');
      create('english', 'commercial', 1234);

      expect(createStub).to.have.been.calledOnce;
      expect(createStub).to.have.been.calledWith({ language: 'english', game_version: 'commercial', code: 1234 });
    });
  });

  describe('update', () => {
    it('update calls Token.update with correct arguments  ', () => {
      const updateStub = sinon.stub(mongoose.Model, 'findOneAndUpdate');
      update(1234, ['123', '1234', '12345']);

      expect(updateStub).to.have.been.calledOnce;
      expect(updateStub).to.have.been.calledWith(
        { code: 1234 },
        { $set: { boardIds: ['123', '1234', '12345'] } },
        { new: true }
      );
    });
  });

  describe('check', () => {
    it('check calls Token.findOne with correct arguments ', () => {
      const findOneStub = sinon.stub(mongoose.Model, 'findOne');
      check(1234);

      expect(findOneStub).to.have.been.calledOnce;
      expect(findOneStub).to.have.been.calledWith({ code: 1234 });
    });
  });

  describe('getAll', () => {
    it('getAll calls Board.find ', () => {
      const findStub = sinon.stub(mongoose.Model, 'find');
      getAll();

      expect(findStub).to.have.been.calledOnce;
      expect(findStub).to.have.been.calledWith();
      expect(findStub).not.to.have.been.calledWith(null);
    });
  });
});
