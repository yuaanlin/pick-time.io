import { DateTimeRange } from './DateTimeRange';

export interface Pick {
  eventId: string;
  userName: string;
  value: DateTimeRange[];
  createdAt: Date;
}

export interface SerializedPick {
  _id: string;
  eventId: string;
  userName: string;
  value: string[];
  createdAt: string;
}

export type EventPicksResults = { name: string, picks: DateTimeRange[] }[];

export interface EventResult {
  name: string,
  picks: DateTimeRange[]
}

export interface SerializedEventResult {
  name: string,
  picks: string[]
}

export function parsePick(p: SerializedPick): Pick {
  return {
    eventId: p.eventId,
    userName: p.userName,
    value: p.value.map(v => DateTimeRange().fromString(v)),
    createdAt: new Date(p.createdAt),
  };
}
