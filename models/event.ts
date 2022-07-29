import { DateValue } from './date';
import { TimeRange } from './time';

export interface EventData {
  nanoid: string;
  title: string;
  availableDates: DateValue[];
  availableTimes: TimeRange[];
}

export interface SerializedEventData {
  nanoid: string;
  title: string;
  availableDates: string[];
  availableTimes: string[];
}

export function parseEventData(e: SerializedEventData): EventData {
  return {
    nanoid: e.nanoid,
    title: e.title,
    availableDates: e.availableDates.map(d => DateValue().fromString(d))
      .sort((a, b) => a.laterThan(b) ? 1 : -1),
    availableTimes: e.availableTimes.map(t => TimeRange().fromString(t))
      .sort((a, b) => a.laterThan(b) ? 1 : -1)
  };
}
