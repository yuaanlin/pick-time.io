export interface Time {
  hour: number;
  minute: number;
  toString: () => string;
  fromString: (v: string) => Time;
  valueOf: () => number;
  equals: (other: Time) => boolean;
  addMinutes: (minutes: number) => Time;
  earlierThan: (other: Time) => boolean;
  laterThan: (other: Time) => boolean;
}

export function Time(hour?: number, minute?: number): Time {
  return {
    hour: hour || 0,
    minute: minute || 0,
    toString(): string {
      return `${this.hour}:${this.minute < 10 ? '0' : ''}${this.minute}`;
    },
    fromString(v) {
      const h = +v.split(':')[0];
      const m = +v.split(':')[1];
      if (isNaN(h) || isNaN(m)) throw new Error(
        'Cannot parsing string ' + v + ' into Time Object');
      return Time(h, m);
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
    },
    earlierThan(other: Time): boolean {
      return this.hour < other.hour ||
        (this.hour === other.hour && this.minute < other.minute);
    },
    laterThan(other: Time): boolean {
      return this.hour > other.hour ||
        (this.hour === other.hour && this.minute > other.minute);
    }
  };
}

export interface TimeRange {
  start: Time;
  end: Time;
  toString: () => string;
  fromString: (v: string) => TimeRange;
  valueOf: () => string;
  equals: (other: TimeRange) => boolean;
  earlierThan: (other: TimeRange) => boolean;
  laterThan: (other: TimeRange) => boolean;
}

export function TimeRange(start?: Time, end?: Time): TimeRange {
  return {
    start: start || Time(),
    end: end || Time(),
    toString(): string {
      return `${this.start.toString()}-${this.end.toString()}`;
    },
    fromString(v: string) {
      const s = v.split('-')[0];
      const e = v.split('-')[1];
      return TimeRange(Time().fromString(s), Time().fromString(e));
    },
    valueOf(): string {
      return this.toString();
    },
    equals(other: TimeRange): boolean {
      return this.start.equals(other.start) && this.end.equals(other.end);
    },
    earlierThan(other) {
      return this.start.earlierThan(other.start);
    },
    laterThan(other) {
      return this.start.laterThan(other.start);
    }
  };
}
