import { DateValue } from './date';
import { TimeRange } from './time';
import { ObjectId } from 'bson';

export interface EventData {
  _id: ObjectId;
  nanoid: string;
  title: string;
  availableDates: DateValue[];
  availableTimes: TimeRange[];
}

export interface SerializedEventData {
  _id: string;
  nanoid: string;
  title: string;
  availableDates: string[];
  availableTimes: string[];
}

export function parseEventData(e: SerializedEventData): EventData {
  return {
    _id: new ObjectId(e._id),
    nanoid: e.nanoid,
    title: e.title,
    availableDates: e.availableDates.map(d => DateValue().fromString(d))
      .sort((a, b) => a.laterThan(b) ? 1 : -1),
    availableTimes: e.availableTimes.map(t => TimeRange().fromString(t))
      .sort((a, b) => a.laterThan(b) ? 1 : -1)
  };
}
