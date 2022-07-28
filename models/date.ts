export type DayCode =
  'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface DateValue {
  year: number;
  month: number;
  date: number;
  toString: () => string;
  fromString: (v: string) => DateValue;
  equals: (other: DateValue) => boolean;
  earlierThan: (other: DateValue) => boolean;
  laterThan: (other: DateValue) => boolean;
  getDayCode: () => DayCode;
  addMonth: (n: number) => DateValue;
}

export function DateValue(year?: number, month?: number,
  date?: number): DateValue {
  return {
    year: year || 0,
    month: month || 0,
    date: date || 0,
    toString() {
      return year + '/' + month + '/' + date;
    },
    fromString(v) {
      const y = +v.split('/')[0];
      const m = +v.split('/')[1];
      const d = +v.split('/')[2];
      if (isNaN(y) || isNaN(m) || isNaN(d)) throw new Error(
        'Cannot parse string ' + v + ' into Date value');
      return DateValue(y, m, d);
    },
    equals(other) {
      return this.year === other.year && this.month === other.month &&
        this.date === other.date;
    },
    laterThan(other) {
      return this.year > other.year ||
        (this.year === other.year && this.month > other.month) ||
        (this.year === other.year && this.month === other.month && this.date >
          other.date);
    },
    earlierThan(other) {
      return this.year < other.year ||
        (this.year === other.year && this.month < other.month) ||
        (this.year === other.year && this.month === other.month && this.date <
          other.date);
    },
    getDayCode() {
      const d = new Date(this.year, this.month - 1, this.date);
      return ([
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ] as DayCode[])[d.getDay()];
    },
    addMonth(n) {
      if (this.month + n > 12) {
        return DateValue(this.year + 1, this.month + n - 12, this.date);
      }
      return DateValue(this.year, this.month + n, this.date);
    }
  };
}

export function getDaysInMonth(year: number, month: number): DateValue[] {
  const days = new Date(year, month, 0).getDate();
  const result: DateValue[] = [];
  for (let i = 1; i <= days; i++) {
    result.push(DateValue(year, month, i));
  }
  return result;
}

export function getEmptySlotNumberOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
