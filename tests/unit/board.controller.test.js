import chai from 'chai';
import { insertMany, findById, findByIdAndUpdate, findByTokenId } from '../../src/services/board.service';
import { getBoards, createBoards, updateBoard, loadBoard } from '../../src/controllers/server/board.controller';
import sinon from 'sinon';

chai.expect();

describe('Board controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  // describe('Error handling', () => {
  //   it('should log the error on fail', () => {});

  //   it('should send a status of 500', () => {});

  //   it('should send the error', () => {});
  // });

  describe('Sending correct status codes', () => {
    it('create board sends statusCode 201 on success', () => {
      const mockReq = { body: {} };
      const mReply = {};
    });
  });

  describe('Transfering correct data to DB', () => {});

  describe('Sending correct response', () => {});
});
