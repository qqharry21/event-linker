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

export interface DateRange {
  from?: Date;
  to?: Date;
}

export enum EventStatus {
  ALL,
  PAST,
  CURRENT,
}
