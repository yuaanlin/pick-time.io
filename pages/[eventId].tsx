import { parseEventData, SerializedEventData } from '../models/event';
import PageHead from '../components/PageHead';
import PageContainer from '../components/PageContainer';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import AvailabilityTable from '../components/AvailabilityTable';
import getServerSidePropsWithEventData
  from '../services/getServerSidePropsWithEventData';
import { useTranslation } from 'next-i18next';

interface Props {
  event: SerializedEventData;
}

export default function (props: Props) {
  const { event } = props;
  const { t } = useTranslation();
  const eventData = parseEventData(event);
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
        <p className="mb-8">{t('current_availability')}</p>
        <AvailabilityTable event={eventData}/>
      </div>
      <button
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
