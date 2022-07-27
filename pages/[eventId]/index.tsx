import PageHead from '../../components/PageHead';
import PageContainer from '../../components/PageContainer';
import { parseEventData, SerializedEventData } from '../../models/event';
import Footer from '../../components/Footer';
import TopNav from '../../components/TopNav';
import AvailabilityTable from '../../components/AvailabilityTable';
import getServerSidePropsWithEventData
  from '../../services/getServerSidePropsWithEventData';
import useSession from '../../hooks/useSession';
import { parsePick, Pick } from '../../models/Pick';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Props {
  event: SerializedEventData;
}

export default function (props: Props) {
  const { event } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const eventData = parseEventData(event);
  const session = useSession(eventData.nanoid);

  const [result, setResult] = useState<Pick[]>();
  useEffect(() => {
    if (session) {
      fetch(`/api/events/${eventData.nanoid}/pick`,
        { headers: { Authorization: `Bearer ${session.token}` } })
        .then(res => res.json())
        .then(res => setResult(res.map(parsePick)))
        .catch(err => console.error(err));
    }
  }, [session]);

  return <div>
    <PageHead
      title={t('event_page_title', { eventTitle: event.title })}/>
    <PageContainer>
      <TopNav/>
      <p className="text-2xl">{t('welcome')}</p>
      <div className="mt-6">
        <p className="text-2xl">{t('event_page_welcome')}</p>
        <p className="text-2xl">{eventData.title}</p>
      </div>
      <div className="mt-16">
        <p className="mb-8">{t('current_availability_label')}</p>
        <AvailabilityTable readonly event={eventData}/>
      </div>
      <button
        onClick={async () => {
          if (session) await router.push(`/${eventData.nanoid}/pick`);
          else await router.push(`/${eventData.nanoid}/signin`);
        }}
        className="fixed bottom-8 right-8 bg-zinc-300 items-center
        px-4 py-2 rounded-lg flex z-50 shadow-lg">
        <p>{t('schedule_now')}</p>
        <img src="/arrow.svg" alt="" className="ml-4 h-3"/>
      </button>
    </PageContainer>
    <Footer/>
  </div>;
}

export const getServerSideProps = getServerSidePropsWithEventData;
