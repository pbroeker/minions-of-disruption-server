import chai from 'chai';
import { getBoards, createBoards, updateBoard, loadBoard } from '../../src/controllers/server/board.controller';
import sinon from 'sinon';

chai.expect();

describe('Board controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Error handling', () => {
    it('should log the error on fail', () => {});

    it('should send a status of 500', () => {});

    it('should send the error', () => {});
  });

  describe('Sending correct status codes', () => {});

  describe('Transfering correct data to DB', () => {});

  describe('Sending correct response', () => {});
});
