export interface Room {
  id: number;
  name?: string;
  _id?: string;
  players: User[];
}

export interface User {
  designatedRoom?: number;
  seat: number;
  name: string;
  boardId?: any;
}

export interface Player {
  designatedRoom?: number;
  socketId?: string;
  seat: number;
  name: string;
  role?: Role;
  hand: number[];
  position: number;
  remainingActions: number;
}

export type Role = {
  id: number;
  name: string;
  image: string;
  description: string;
  color: string;
  power: string;
};

export interface CallToAll extends AdminAndSocketCall {
  io: SocketIO.Server;
}

export interface AdminAndSocketCall {
  adminNamespace: SocketIO.Namespace;
  socket: SocketIO.Socket;
}

export interface AdminAndPlayerCall {
  adminNamespace: SocketIO.Namespace;
  playerNamespace: SocketIO.Namespace;
}

export interface PlayerAndSocketCall {
  playerNamespace: SocketIO.Namespace;
  socket: SocketIO.Socket;
}

// export interface Board {

// }

// export interface ServerCTX {

// };
