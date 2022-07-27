import getServerSidePropsWithEventData
  from '../../services/getServerSidePropsWithEventData';
import PageHead from '../../components/PageHead';
import { parseEventData, SerializedEventData } from '../../models/event';
import PageContainer from '../../components/PageContainer';
import Footer from '../../components/Footer';
import AvailabilityTable from '../../components/AvailabilityTable';
import { DateTimeRange } from '../../models/DateTimeRange';
import TopNav from '../../components/TopNav';
import useSession from '../../hooks/useSession';
import { parsePick, Pick } from '../../models/Pick';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';

interface Props {
  event: SerializedEventData;
}

function pick(props: Props) {
  const { t } = useTranslation();
  const { event } = props;
  const eventData = parseEventData(event);
  const router = useRouter();
  const session = useSession(eventData.nanoid);
  const [value, setValue] = useState<DateTimeRange[]>([]);
  const [tab, setTab] = useState<'my' | 'result'>('my');
  const [insertedPick, setInsertedPick] = useState<Pick | null>();
  const [result, setResult] = useState<{ name: string, picks: DateTimeRange[] }[]>();

  useEffect(() => {
    if (session) refresh();
  }, [session]);

  async function refresh() {
    const res = await fetch(`/api/events/${eventData.nanoid}/pick`,
      { headers: { Authorization: `Bearer ${session.token}` } });
    const json = await res.json() as { name: string, picks: string[] }[];
    setResult(json.map(v => ({
      ...v,
      picks: v.picks.map(p => DateTimeRange().fromString(p))
    })));
  }

  async function submit() {
    try {
      if (!session) {
        await router.push(`/${eventData.nanoid}/signin`);
        return;
      }
      if (value.length === 0) return;
      const res = await fetch(`/api/events/${eventData.nanoid}/pick`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`
          },
          body: JSON.stringify({ value: value.map(v => v.toString()) })
        });
      const pick = parsePick(await res.json());
      setInsertedPick(pick);
    } catch (err) {
      console.error(err);
    }
  }

  if (insertedPick) {
    return (
      <div>
        <PageHead
          title={t('event_page_title', { eventTitle: event.title })}/>
        <PageContainer>
          <TopNav/>
          <p className="text-2xl mt-12">{t('result_title')}</p>
          <p className="text-2xl mt-6">{t('result_description')}</p>

          <div className="mt-16">
            <p className="flex-1 p-2 mb-8">
              {t('current_availability_label')}
            </p>
            <AvailabilityTable event={eventData} readonly result={result}/>
          </div>
        </PageContainer>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
      <PageHead
        title={t('event_page_title', { eventTitle: event.title })}/>
      <PageContainer>
        <TopNav/>
        <div className="flex mb-8">
          <p
            onClick={() => setTab('my')}
            className={cx('flex-1 text-center p-2',
              tab === 'my' ? 'border-b-2 border-black' : 'opacity-30')}>
            {t('your_availability_label')}
          </p>
          <p
            onClick={() => setTab('result')}
            className={cx('flex-1 text-center p-2',
              tab === 'result' ? 'border-b-2 border-black' : 'opacity-30')}>
            {t('current_availability_label')}
          </p>
        </div>
        <AvailabilityTable
          readonly={tab === 'result'}
          result={result}
          event={eventData}
          value={value}
          onChange={setValue}/>
        <button
          className="fixed bottom-8 right-8 bg-zinc-300 items-center
        px-4 py-2 rounded-lg flex z-50 shadow-lg"
          onClick={submit}>
          <p>{t('submit_result')}</p>
          <img src="/arrow.svg" alt="" className="ml-4 h-3"/>
        </button>
      </PageContainer>
      <Footer/>
    </div>
  );
}

export default pick;

export const getServerSideProps = getServerSidePropsWithEventData;
