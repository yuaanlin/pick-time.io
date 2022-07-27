import { EventData } from '../models/event';
import { DateTimeRange } from '../models/DateTimeRange';
import touchIn from '../utils/touchIn';
import { useTranslation } from 'next-i18next';
import { TouchEvent, useRef, useState } from 'react';
import cx from 'classnames';

interface Props {
  event: EventData;
  readonly?: boolean;
}

function AvailabilityTable(props: Props) {

  const {
    event,
    readonly
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const [touchStart, setTouchStart] = useState<DateTimeRange>();
  const [touchEnd, setTouchEnd] = useState<DateTimeRange>();

  function getColor(dtr: DateTimeRange) {
    if (touchStart && dtr.equals(touchStart)) {
      return 'bg-[#ffc107]';
    }
    if (!touchStart || !touchEnd) {
      return 'bg-white';
    }
    const dtrTime = dtr.timeRange.start;
    const touchStartTime = touchStart.timeRange.start;
    const touchEndTime = touchEnd.timeRange.start;
    if ((dtrTime.laterThan(touchStartTime) &&
        dtrTime.earlierThan(touchEndTime) ||
        dtrTime.earlierThan(touchStartTime) &&
        dtrTime.laterThan(touchEndTime)) ||
      dtrTime.equals(touchStartTime) || dtrTime.equals(touchEndTime)) {
      const dtrDate = dtr.date;
      const touchStartDate = touchStart.date;
      const touchEndDate = touchEnd.date;
      if ((dtrDate.laterThan(touchStartDate) &&
          dtrDate.earlierThan(touchEndDate) ||
          dtrDate.earlierThan(touchStartDate) &&
          dtrDate.laterThan(touchEndDate)) ||
        dtrDate.equals(touchStartDate) ||
        dtrDate.equals(touchEndDate)) {
        return 'bg-[#ffc107]';
      }
    }
  }

  const handleTouchMove = (e: TouchEvent<HTMLTableElement>) => {
    const touch = e.touches[0];
    const containerRight = containerRef.current?.getBoundingClientRect().right;
    const containerLeft = containerRef.current?.getBoundingClientRect().left;
    const containerScrollLeft = containerRef.current?.scrollLeft;
    if (containerRight !== undefined && containerLeft !== undefined &&
      containerScrollLeft !== undefined) {
      if (containerRight - touch.clientX < 30)
        containerRef.current?.scrollTo({ left: containerScrollLeft + 3 });
      if (touch.clientX - containerLeft < 30)
        containerRef.current?.scrollTo({ left: containerScrollLeft - 3 });
    }
    const container = containerRef.current;
    if (!container) return;
    let result: DateTimeRange | undefined;
    container.childNodes.forEach((dateCol: any) => {
      const col = dateCol as unknown as HTMLDivElement;
      if (!col.attributes.getNamedItem('value')) return;
      col.childNodes[2].childNodes.forEach((timeRow: any) => {
        const row = timeRow as unknown as HTMLDivElement;
        const dtrValue = row.attributes.getNamedItem('value')?.value;
        if (!dtrValue) return;
        const dtr = DateTimeRange().fromString(dtrValue);
        if (touchIn(touch, row.getBoundingClientRect())) {
          result = dtr;
        }
      });
    });
    if (result) {
      setTouchEnd(result);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(undefined);
    setTouchEnd(undefined);
  };

  return <div className="flex w-full">
    <div className="pt-10">
      {event.availableTimes.map(
        time => <div
          key={time.toString()}
          className="h-12 pr-2">
          <p>{time.start.toString()}</p>
        </div>)}
    </div>
    <div className="flex flex-grow overflow-x-scroll pb-12" ref={containerRef}>
      {event.availableDates.map(date =>
        <div
          /* @ts-ignore */
          value={date.toString()}
          key={date.toString()}
          className="flex flex-col mr-2">
          <p className="text-center">{date.toString()}</p>
          <p className="text-center">
            {t('date_day_short_' + date.getDayCode())}
          </p>
          <div className="border-2 border-black rounded-lg">
            {event.availableTimes.map(time => {
              const dtr = DateTimeRange(date, time);
              return <div
                /* @ts-ignore */
                value={dtr.toString()}
                key={dtr.toString()}
                onTouchStart={() => setTouchStart(dtr)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className={cx(
                  'h-12 border-b border-black border-opacity-30 w-24',
                  !readonly && 'touch-none',
                  getColor(dtr))}>
              </div>;
            })}
          </div>
        </div>)}
    </div>
  </div>;
}

export default AvailabilityTable;
