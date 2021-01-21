const mockRooms = [
  {
    tokenId: 1,
    boardData: 'Test1',
    name: 'testname1,',
    players: '[1,2,3]',
    id: 1,
  },
  {
    tokenId: 2,
    boardData: 'Test2',
    name: 'testname2,',
    players: '[1,2,3]',
    id: 2,
  },
];

const mockBoards = [
  {
    tokenId: 1,
    boardData: 'testData1',
    name: 'testBoard1',
    players: '[player1, player2]',
    id: '1234',
  },
  {
    tokenId: 2,
    boardData: 'testData2',
    name: 'testBoard2',
    players: '[player3, player4]',
    id: '12345',
  },
  {
    tokenId: 2,
    boardData: 'testData3',
    name: 'testBoard3',
    players: '[player5, player6]',
    id: '123456',
  },
];

const mockTokens = [
  {
    code: 1234,
    language: 'english',
    game_version: 'public',
    boardIds: ['board1', 'board2'],
  },
  {
    code: 5678,
    language: 'dutch',
    game_version: 'Organisation',
    boardIds: ['board3', 'board4'],
  },
  {
    code: 9012,
    language: 'english',
    game_version: 'public',
    boardIds: ['board3', 'board4'],
  },
];

export { mockRooms, mockBoards, mockTokens };
