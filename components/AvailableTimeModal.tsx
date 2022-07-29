import { DateTimeRange } from '@models/DateTimeRange';
import { EventData } from '@models/event';
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  timeRange: DateTimeRange | undefined;
  event: EventData;
  result?: { name: string, picks: DateTimeRange[] }[];
  onClose: () => void;
}

function AvailableTimeModal(props: Props) {
  const {
    onClose,
    timeRange,
    result,
    event
  } = props;

  const [isShowing, setIsShowing] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (timeRange) setTimeout(() => setIsShowing(true), 100);
    else setTimeout(() => setIsShowing(false), 500);
  }, [timeRange]);

  if (!timeRange && !isShowing) return null;

  const availablePicks = (timeRange && result) ? result.filter(
    r => r.picks.find(p => p.equals(timeRange))) : [];
  const unavailablePicks = (timeRange && result) ? result.filter(
    r => !r.picks.find(p => p.equals(timeRange))) : [];

  return <>
    <div
      onClick={props.onClose}
      className={cx(
        'w-screen h-screen bg-black bg-opacity-30 transition-all',
        'touch-none fixed top-0 left-0 duration-300 z-50',
        (!isShowing || !props.timeRange) ? 'opacity-0' : 'opacity-100')}/>
    <div
      className={cx('bg-white w-screen fixed touch-none z-50',
        'bottom-0 left-0 rounded-t-2xl transition-all duration-300',
        'shadow-xl pt-8 pb-16',
        (!isShowing || !props.timeRange) && '-bottom-[100vh]')}>
      {timeRange && <div className="max-w-md mx-auto">
        <p className="text-2xl text-center">
          {timeRange.timeRange.toString()}
        </p>
        <p className="text-center">
          {t('date_month_' + timeRange.date.getMonthCode()) + ' '}
          {timeRange.date.date + ' '}
          {t('date_day_' + timeRange.date.getDayCode())}
        </p>
        <p className="text-center opacity-30 my-6">
          {availablePicks.length}/{result?.length}
          {' ' + t('available_member_ratio_label')}
        </p>
        <div className="flex flex-row flex-wrap mt-6">
          {availablePicks.map(r => <p
            key={r.name}
            className="w-1/2 text-center mb-2">
            {r.name}
          </p>)}
          {unavailablePicks.map(r => <p
            key={r.name}
            className="opacity-30 w-1/2 text-center mb-2">
            {r.name}
          </p>)}
        </div>
      </div>}
    </div>
  </>;
}

export default AvailableTimeModal;
