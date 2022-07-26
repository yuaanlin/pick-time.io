import {
  DateValue,
  getDaysInMonth,
  getEmptySlotNumberOfMonth
} from '../models/date';
import touchIn from '../utils/touchIn';
import { TouchEventHandler, useRef, useState } from 'react';
import cx from 'classnames';
import { useTranslation } from 'next-i18next';

interface Props {
  value: DateValue[];
  onChange: (v: DateValue[]) => void;
}

const daysCode = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
];

function DatePicker(props: Props) {
  const {
    value,
    onChange
  } = props;
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currYear, setCurrYear] = useState(new Date().getFullYear());
  const [currMonth, setCurrMonth] = useState(new Date().getMonth() + 1);

  const [touchStart, setTouchStart] = useState<DateValue>();
  const [touchEnd, setTouchEnd] = useState<DateValue>();

  const days = getDaysInMonth(currYear, currMonth);
  const emptySlotCount = getEmptySlotNumberOfMonth(currYear, currMonth);
  const emptySlot = [];
  for (let i = 0; i < emptySlotCount; i++) {
    emptySlot.push(<div key={i}></div>);
  }

  function nextMonth() {
    if (currMonth === 12) {
      setCurrYear(currYear + 1);
      setCurrMonth(1);
      return;
    }
    setCurrMonth(currMonth + 1);
  }

  function prevMonth() {
    if (currMonth === 1) {
      setCurrYear(currYear - 1);
      setCurrMonth(12);
      return;
    }
    setCurrMonth(currMonth - 1);
  }

  function getColor(d: DateValue) {
    if (touchStart && touchEnd) {
      if (d.laterThan(touchStart) && d.earlierThan(touchEnd) ||
        d.laterThan(touchEnd) && d.earlierThan(touchStart) ||
        d.equals(touchStart) || d.equals(touchEnd)) {
        if (value.find(r => r.equals(touchStart))) return 'border-black';
        return 'border-[#FFB524] text-[#FFB524]';
      }
    }

    if (value.find(v => v.equals(d)))
      return 'border-[#FFB524] text-[#FFB524]';

    return 'border-black';
  }

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    const touch = e.touches[0];
    if (touch.clientY > window.innerHeight - 100) {
      window.scrollTo({
        top: window.scrollY + 20,
        behavior: 'smooth'
      });
    }
    if (touch.clientY < 100) {
      window.scrollTo({
        top: window.scrollY - 20,
        behavior: 'smooth'
      });
    }
    let end: string | undefined;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    if (touchIn(touch, containerRect)) {
      containerRef.current?.childNodes.forEach((node) => {
        const rect = (node as HTMLElement).getBoundingClientRect();
        if (touchIn(touch, rect)) {
          end = (node as HTMLElement).attributes.getNamedItem('value')?.value;
        }
      });
    }
    if (end) setTouchEnd(DateValue().fromString(end));
  };

  const handleTouchEnd = () => {
    if (!touchStart) return;
    if (!touchEnd) {
      if (value.find(a => a.equals(touchStart)))
        onChange([...value.filter(v => !v.equals(touchStart))]);
      else onChange([...value, touchStart]);
      return;
    }
    const s = touchStart.laterThan(touchEnd) ? touchEnd : touchStart;
    const e = touchStart.earlierThan(touchEnd) ? touchEnd : touchStart;
    const append = days.filter(
      opt => opt.equals(s) || opt.equals(e) ||
        (opt.laterThan(s) && opt.earlierThan(e)));
    let v: any = {};
    value.forEach((t) => v[t.toString()] = true);
    if (value.find(r => r.equals(touchStart))) append.forEach(
      (t) => v[t.toString()] = false);
    else append.forEach((t) => v[t.toString()] = true);
    onChange(Object.keys(v).filter(t => v[t])
      .map(t => DateValue().fromString(t)));
    setTouchStart(undefined);
    setTouchEnd(undefined);
  };

  return <div className="w-full">
    <div className="flex">
      {(currYear !== new Date().getFullYear() || currMonth !==
        new Date().getMonth() + 1) && <p onClick={prevMonth}>{'<'}</p>}
      <p className="text-center flex-grow">
        {currMonth} {currYear}
      </p>
      <p onClick={nextMonth}>{'>'}</p>
    </div>
    <div className="grid-cols-7 grid">
      {daysCode.map(d => <p key={d} className="text-center my-4">
        {t('date_day_short_' + d)}
      </p>)}
    </div>
    <div className="grid grid-cols-7" ref={containerRef}>
      {emptySlot}
      {days.map(d => <div
        key={d.toString()}
        /* @ts-ignore */
        value={d.toString()}
        onTouchStart={() => setTouchStart(d)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cx('border-2 rounded-full w-10 h-10 ',
          'flex items-center justify-center m-2',
          'touch-none',
          getColor(d))}>
        {d.date > 9 ? d.date : '0' + d.date}
      </div>)}
    </div>
  </div>;
}

export default DatePicker;
