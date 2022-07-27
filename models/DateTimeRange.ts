import { DateValue } from './date';
import { TimeRange } from './time';

export interface DateTimeRange {
  date: DateValue;
  timeRange: TimeRange;
  toString: () => string;
  fromString: (str: string) => DateTimeRange;
  equals: (other: DateTimeRange) => boolean;
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
    }
  };
}
