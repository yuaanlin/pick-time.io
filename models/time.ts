export interface Time {
  hour: number;
  minute: number;
  toString: () => string;
  valueOf: () => number;
  equals: (other: Time) => boolean;
  addMinutes: (minutes: number) => Time;
}

export function Time(hour?: number, minute?: number): Time {
  return {
    hour: hour || 0,
    minute: minute || 0,
    toString(): string {
      return `${this.hour}:${this.minute < 10 ? '0' : ''}${this.minute}`;
    },
    valueOf(): number {
      return this.hour * 60 + this.minute;
    },
    equals(other: Time): boolean {
      return this.hour === other.hour && this.minute === other.minute;
    },
    addMinutes(minutes: number): Time {
      const newMinute = this.minute + minutes;
      const newHour = this.hour + Math.floor(newMinute / 60);
      return Time(newHour, newMinute % 60);
    }
  };
}

export interface TimeRange {
  start: Time;
  end: Time;
  toString: () => string;
  valueOf: () => string;
  equals: (other: TimeRange) => boolean;
}

export function TimeRange(start?: Time, end?: Time) {
  return {
    start: start || Time(),
    end: end || Time(),
    toString(): string {
      return `${this.start.toString()}-${this.end.toString()}`;
    },
    valueOf(): string {
      return this.toString();
    },
    equals(other: TimeRange): boolean {
      return this.start.equals(other.start) && this.end.equals(other.end);
    }
  };
}

export function getTimeFromString(str: string): Time {
  const [hour, minute] = str.split(':');
  return Time(parseInt(hour, 10), parseInt(minute, 10));
}

export function getTimeRangeFromString(str: string): TimeRange {
  const [start, end] = str.split('-');
  return TimeRange(getTimeFromString(start), getTimeFromString(end));
}
