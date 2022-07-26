export interface DateValue {
  year: number;
  month: number;
  date: number;
  toString: () => string;
  fromString: (v: string) => DateValue;
  equals: (other: DateValue) => boolean;
  earlierThan: (other: DateValue) => boolean;
  laterThan: (other: DateValue) => boolean;
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
