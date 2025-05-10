export interface Participant {
  id: string;
  name: string;
  avatar: string;
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  description: string;
  participants: Participant[];
}

export enum EventStatus {
  ALL = "all",
  PAST = "past",
  CURRENT = "current",
}
