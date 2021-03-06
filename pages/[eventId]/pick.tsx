import useSession from '@hooks/useSession';
import { DateTimeRange } from '@models/DateTimeRange';
import { EventResult, SerializedEventResult } from '@models/Pick';
import PageHead from '@components/PageHead';
import PageContainer from '@components/PageContainer';
import Footer from '@components/Footer';
import AvailabilityTable from '@components/AvailabilityTable';
import TopNav from '@components/TopNav';
import { parseEventData, SerializedEventData } from '@models/event';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import NProgress from 'nprogress';
import { getEventAndResultProps } from '@services/getEventProps';
import usePickResult from '@hooks/usePickResult';

interface Props {
  event: SerializedEventData;
  results: SerializedEventResult[];
}

function pick(props: Props) {
  const { t } = useTranslation();
  const { event } = props;
  const results: EventResult[] = props.results.map(r => ({
    name: r.name,
    picks: r.picks.map(p => DateTimeRange().fromString(p))
  }));
  const eventData = parseEventData(event);
  const router = useRouter();
  const session = useSession(eventData.nanoid);
  const [value, setValue] = useState<DateTimeRange[]>([]);
  const [tab, setTab] = useState<'my' | 'result'>('my');
  const clientFetchedResults = usePickResult(eventData.nanoid);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function submit() {
    if (!session) {
      await router.push(`/${eventData.nanoid}/signin`);
      return;
    }
    if (value.length === 0) return;
    NProgress.start();
    try {
      const res = await fetch(`/api/events/${eventData.nanoid}/pick`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.token}`
          },
          body: JSON.stringify({ value: value.map(v => v.toString()) })
        });
      if ((await res.json()).ok) {
        setIsSubmitted(true);
      }
      await clientFetchedResults.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      NProgress.done();
    }
  }

  if (isSubmitted) {
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
            <AvailabilityTable
              event={eventData}
              readonly
              result={clientFetchedResults.result || results}/>
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
            className={cx('flex-1 text-center p-2 select-none cursor-pointer',
              'hover:opacity-70 transition-all',
              tab === 'my' ? 'border-b-2 border-black' : 'opacity-30')}>
            {t('your_availability_label')}
          </p>
          <p
            onClick={() => setTab('result')}
            className={cx('flex-1 text-center p-2 select-none cursor-pointer',
              'hover:opacity-70 transition-all',
              tab === 'result' ? 'border-b-2 border-black' : 'opacity-30')}>
            {t('current_availability_label')}
          </p>
        </div>
        <AvailabilityTable
          readonly={tab === 'result'}
          result={clientFetchedResults.result || results}
          event={eventData}
          value={value}
          onChange={setValue}/>
        <button
          className="fixed bottom-8 right-8 bg-zinc-300 items-center
        px-4 py-2 rounded-lg flex z-40 shadow-lg"
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

export const getStaticPaths = () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps = getEventAndResultProps;
