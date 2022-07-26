import { parseEventData, SerializedEventData } from '../models/event';
import getEvent from '../services/getEvent';
import PageHead from '../components/PageHead';
import PageContainer from '../components/PageContainer';
import TopNav from '../components/TopNav';
import Footer from '../components/Footer';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const eventId = ctx.query.eventId;
  if (!eventId || typeof eventId !== 'string') return {
    props: {},
    redirect: { destination: '/', }
  };
  const event = await getEvent(eventId);
  return {
    props: {
      event,
      ...(await serverSideTranslations(
        ctx.locale ? ctx.locale : 'en-US',
        ['common']))
    }
  };
};
