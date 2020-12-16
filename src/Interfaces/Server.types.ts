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
