import touchIn from '@utils/touchIn';
import { Time, TimeRange } from '@models/time';
import { MouseEventHandler, TouchEventHandler, useRef, useState } from 'react';
import cx from 'classnames';

interface Props {
  value?: TimeRange[];
  onChange?: (v: TimeRange[]) => void;
  readonly?: boolean;
}

function TwoColumnTimePicker(props: Props) {

  const leftTimeOptions = getOptions(Time(0, 0), Time(12, 0), 60);
  const rightTimeOptions = getOptions(Time(12, 0), Time(24, 0), 60);
  const options = [...leftTimeOptions, ...rightTimeOptions];

  const {
    value,
    onChange,
    readonly: isReadonly,
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
      if (value?.find(r => r.equals(touchStart))) return 'bg-white';
      return 'bg-[#FFB524]';
    }
    if (value?.find(r => r.equals(opt))) return 'bg-[#FFB524]';
    return '';
  }

  const handleTouchMove: TouchEventHandler<HTMLDivElement> = (e) => {
    return handleMove(e.touches[0]);
  };

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    return touchStart && handleMove(e);
  };

  const handleMove = (touch: { clientX: number, clientY: number }) => {
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

  const handleTouchEnd = (ev: any) => {
    ev.preventDefault();
    setTouchStart(undefined);
    setTouchEnd(undefined);
    if (!touchStart || isReadonly || !onChange || !touchEnd) return;
    const s = touchStart.laterThan(touchEnd) ? touchEnd : touchStart;
    const e = touchStart.earlierThan(touchEnd) ? touchEnd : touchStart;
    const append = options.filter(
      opt => opt.equals(s) || opt.equals(e) ||
        (opt.laterThan(s) && opt.earlierThan(e)));
    let v: any = {};
    value?.forEach((t) => v[t.toString()] = true);
    if (value?.find(r => r.equals(touchStart))) append.forEach(
      (t) => v[t.toString()] = false);
    else append.forEach((t) => v[t.toString()] = true);
    onChange(Object.keys(v).filter(t => v[t])
      .map(t => TimeRange().fromString(t)));
  };

  return <div className="w-full flex gap-4">
    <div className="relative -top-[10px] text-right">
      {leftTimeOptions.map(
        (opt) => <p key={opt.toString()} style={{ height: 36 }}>
          {opt.start.toString()}
        </p>)}
      <p>12:00</p>
    </div>
    <div className="flex-grow">
      <div
        ref={leftContainerRef}
        className="border-4 border-black rounded-3xl overflow-hidden
        w-full cursor-pointer">
        {leftTimeOptions.map((opt) => <div
          key={opt.toString()}
          style={{ height: 36 }}
          /* @ts-ignore */
          value={opt.toString()}
          className={cx(
            'w-full border-b-2 border-opacity-30 border-black',
            'touch-none select-none',
            getColor(opt))}
          onTouchStart={() => {
            if (!isReadonly) {
              setTouchStart(opt);
              setTouchEnd(opt);
            }
          }}
          onMouseDown={() => {
            if (!isReadonly) {
              setTouchStart(opt);
              setTouchEnd(opt);
            }
          }}
          onTouchMove={handleTouchMove}
          onMouseMove={handleMouseMove}
          onTouchEnd={handleTouchEnd}
          onMouseUp={handleTouchEnd}
        />)}
      </div>
    </div>
    <div className="flex-grow">
      <div
        ref={rightContainerRef}
        className="border-4 border-black rounded-3xl overflow-hidden
         w-full cursor-pointer">
        {rightTimeOptions.map(opt => <div
          key={opt.toString()}
          style={{ height: 36 }}
          /* @ts-ignore */
          value={opt.toString()}
          className={cx(
            'w-full border-b-2 border-opacity-30 border-black',
            'touch-none select-none',
            getColor(opt))}
          onTouchStart={() => {
            if (!isReadonly) {
              setTouchStart(opt);
              setTouchEnd(opt);
            }
          }}
          onMouseDown={() => {
            if (!isReadonly) {
              setTouchStart(opt);
              setTouchEnd(opt);
            }
          }}
          onTouchMove={handleTouchMove}
          onMouseMove={handleMouseMove}
          onTouchEnd={handleTouchEnd}
          onMouseUp={handleTouchEnd}
        />)}
      </div>
    </div>
    <div className="relative -top-[10px]">
      {rightTimeOptions.map(
        (opt) => <p key={opt.toString()} style={{ height: 36 }}>
          {opt.start.toString()}
        </p>)}
      <p>24:00</p>
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
