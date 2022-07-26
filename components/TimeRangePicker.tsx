import { getTimeRangeFromString, TimeRange } from '../models/time';
import { TouchEventHandler, useRef, useState } from 'react';
import cx from 'classnames';

interface Props {
  options: TimeRange[];
  onChange: (timeRanges: TimeRange[]) => void;
  value: TimeRange[];
  slotHeight?: number;
}

function TimeRangePicker(props: Props) {
  const {
    options,
    value,
    onChange,
    slotHeight
  } = props;
  let slotHeightValue = slotHeight || 32;
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number>(-1);
  const [touchEnd, setTouchEnd] = useState<number>(-1);
  const isTouching = touchStart !== -1 && touchEnd !== -1;

  function getColor(i: number) {
    if (isTouching && (i >= touchStart && i <= touchEnd ||
      i <= touchStart && i >= touchEnd)) {
      if (value.find(r => r.equals(options[touchStart]))) return 'bg-white';
      return 'bg-[#FFB524]';
    }
    if (value.find(r => r.equals(options[i]))) return 'bg-[#FFB524]';
    return '';
  }

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    if (e.touches[0].clientY > window.innerHeight - 100) {
      window.scrollTo({
        top: window.scrollY + 20,
        behavior: 'smooth'
      });
    }
    if (e.touches[0].clientY < 100) {
      window.scrollTo({
        top: window.scrollY - 20,
        behavior: 'smooth'
      });
    }
    let end = -1;
    containerRef.current?.childNodes.forEach((node, ind) => {
      const rect = (node as HTMLElement).getBoundingClientRect();
      if (rect.top < e.touches[0].clientY) {
        end = ind;
      }
    });
    setTouchEnd(end);
  };

  const handleTouchEnd = () => {
    const s = Math.min(touchStart, touchEnd);
    const e = Math.max(touchStart, touchEnd);
    const append = options.slice(s, e + 1);
    let v: any = {};
    value.forEach((t) => v[t.toString()] = true);
    if (value.find(r => r.equals(options[touchStart]))) append.forEach(
      (t) => v[t.toString()] = false);
    else append.forEach((t) => v[t.toString()] = true);
    if (s == -1) v[options[i].toString()] = !v[options[i].toString()];
    onChange(
      Object.keys(v).filter(t => v[t])
        .map(t => getTimeRangeFromString(t))
    );
    setTouchStart(-1);
    setTouchEnd(-1);
  };

  return <div
    ref={containerRef}
    className="border-4 border-black rounded-3xl overflow-hidden w-full">
    {options.map((opt, i) => <div
      key={i}
      style={{ height: slotHeightValue }}
      className={cx(
        'w-full border-b-2 border-opacity-30 border-black touch-none',
        getColor(i))}
      onTouchStart={() => setTouchStart(i)}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />)}
  </div>;

}

export default TimeRangePicker;
