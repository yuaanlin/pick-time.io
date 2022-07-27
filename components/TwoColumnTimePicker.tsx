import touchIn from '@utils/touchIn';
import { Time, TimeRange } from '@models/time';
import { TouchEventHandler, useRef, useState } from 'react';
import cx from 'classnames';

interface Props {
  value: TimeRange[];
  onChange: (v: TimeRange[]) => void;
}

function TwoColumnTimePicker(props: Props) {

  const leftTimeOptions = getOptions(Time(0, 0), Time(12, 0), 60);
  const rightTimeOptions = getOptions(Time(12, 0), Time(24, 0), 60);
  const options = [...leftTimeOptions, ...rightTimeOptions];

  const {
    value,
    onChange,
  } = props;
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<TimeRange>();
  const [touchEnd, setTouchEnd] = useState<TimeRange>();

  function getColor(opt: TimeRange) {
    if ((touchStart && touchEnd) &&
      (opt.laterThan(touchStart) && opt.earlierThan(touchEnd) ||
        opt.earlierThan(touchStart) && opt.laterThan(touchEnd) ||
        opt.equals(touchStart) || opt.equals(touchEnd))) {
      if (value.find(r => r.equals(touchStart))) return 'bg-white';
      return 'bg-[#FFB524]';
    }
    if (value.find(r => r.equals(opt))) return 'bg-[#FFB524]';
    return '';
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
    const leftRect = leftContainerRef.current?.getBoundingClientRect();
    if (!leftRect) return;
    if (touchIn(touch, leftRect)) {
      leftContainerRef.current?.childNodes.forEach((node) => {
        const rect = (node as HTMLElement).getBoundingClientRect();
        if (touchIn(touch, rect)) {
          end = (node as HTMLElement).attributes.getNamedItem(
            'value')?.value;
        }
      });
    }
    const rightRect = rightContainerRef.current?.getBoundingClientRect();
    if (!rightRect) return;
    if (touchIn(touch, rightRect)) {
      rightContainerRef.current?.childNodes.forEach((node) => {
        const rect = (node as HTMLElement).getBoundingClientRect();
        if (touchIn(touch, rect)) {
          end = (node as HTMLElement).attributes.getNamedItem(
            'value')?.value;
        }
      });
    }
    if (end) setTouchEnd(TimeRange().fromString(end));
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
    const append = options.filter(
      opt => opt.equals(s) || opt.equals(e) ||
        (opt.laterThan(s) && opt.earlierThan(e)));
    let v: any = {};
    value.forEach((t) => v[t.toString()] = true);
    if (value.find(r => r.equals(touchStart))) append.forEach(
      (t) => v[t.toString()] = false);
    else append.forEach((t) => v[t.toString()] = true);
    onChange(Object.keys(v).filter(t => v[t])
      .map(t => TimeRange().fromString(t)));
    setTouchStart(undefined);
    setTouchEnd(undefined);
  };

  return <div className="w-full flex gap-4">
    <div className="relative -top-[10px] text-right">
      {leftTimeOptions.map(
        (opt) => <p key={opt.toString()} style={{ height: 36 }}>
          {opt.start.toString()}
        </p>)}
    </div>
    <div className="flex-grow">
      <div
        ref={leftContainerRef}
        className="border-4 border-black rounded-3xl overflow-hidden w-full">
        {leftTimeOptions.map((opt, i) => <div
          key={i}
          style={{ height: 36 }}
          /* @ts-ignore */
          value={opt.toString()}
          className={cx(
            'w-full border-b-2 border-opacity-30 border-black touch-none',
            getColor(opt))}
          onTouchStart={() => setTouchStart(opt)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />)}
      </div>
    </div>
    <div className="flex-grow">
      <div
        ref={rightContainerRef}
        className="border-4 border-black rounded-3xl overflow-hidden w-full">
        {rightTimeOptions.map((opt, i) => <div
          key={i}
          style={{ height: 36 }}
          /* @ts-ignore */
          value={opt.toString()}
          className={cx(
            'w-full border-b-2 border-opacity-30 border-black touch-none',
            getColor(opt))}
          onTouchStart={() => setTouchStart(opt)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />)}
      </div>
    </div>
    <div className="relative -top-[10px]">
      {rightTimeOptions.map(
        (opt) => <p key={opt.toString()} style={{ height: 36 }}>
          {opt.start.toString()}
        </p>)}
    </div>
  </div>;

}

function getOptions(start: Time, end: Time, duration: 30 | 60) {
  const result: TimeRange[] = [];
  let time = start;
  while (time < end) {
    result.push(TimeRange(time, time.addMinutes(duration)));
    time = time.addMinutes(duration);
  }
  return result;
}

export default TwoColumnTimePicker;
