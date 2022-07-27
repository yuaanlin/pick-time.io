import { DateValue } from './date';
import { TimeRange } from './time';

export interface SerializedDateTimeRange {
  date: string;
  timeRange: string;
}

export interface DateTimeRange {
  date: DateValue;
  timeRange: TimeRange;
  toString: () => string;
  fromString: (str: string) => DateTimeRange;
  equals: (other: DateTimeRange) => boolean;
  earlierThan: (other: DateTimeRange) => boolean;
  laterThan: (other: DateTimeRange) => boolean;
}

export function DateTimeRange(date?: DateValue,
  timeRange?: TimeRange): DateTimeRange {
  return {
    date: date || DateValue(),
    timeRange: timeRange || TimeRange(),
    toString() {
      return `${this.date.toString()} ${this.timeRange.toString()}`;
    },
    fromString(str: string) {
      const [dateStr, timeStr] = str.split(' ');
      return DateTimeRange(DateValue().fromString(dateStr),
        TimeRange().fromString(timeStr));
    },
    equals(other: DateTimeRange) {
      return this.date.equals(other.date) &&
        this.timeRange.equals(other.timeRange);
    },
    earlierThan(other: DateTimeRange) {
      return this.date.earlierThan(other.date) ||
        (this.date.equals(other.date) &&
          this.timeRange.earlierThan(other.timeRange));
    },
    laterThan(other: DateTimeRange) {
      return this.date.laterThan(other.date) ||
        (this.date.equals(other.date) &&
          this.timeRange.laterThan(other.timeRange));
    }
  };
}
