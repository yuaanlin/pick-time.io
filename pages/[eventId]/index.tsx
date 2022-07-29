import useSession from '@hooks/useSession';
import { parseEventData, SerializedEventData } from '@models/event';
import PageHead from '@components/PageHead';
import PageContainer from '@components/PageContainer';
import Footer from '@components/Footer';
import TopNav from '@components/TopNav';
import AvailabilityTable from '@components/AvailabilityTable';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { GetStaticProps } from 'next';
import getEvent from '@services/getEvent';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import getPicks from '@services/getPicks';
import { DateTimeRange } from '@models/DateTimeRange';
import { EventResult, SerializedEventResult } from '@models/Pick';

interface Props {
  event: SerializedEventData;
  results: SerializedEventResult[];
}

export default function (props: Props) {
  const { event, } = props;
  const results: EventResult[] = props.results.map(r => ({
    name: r.name,
    picks: r.picks.map(p => DateTimeRange().fromString(p))
  }));
  const router = useRouter();
  const { t } = useTranslation();
  const eventData = parseEventData(event);
  const session = useSession(eventData.nanoid);

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
        <AvailabilityTable readonly event={eventData} result={results}/>
      </div>
      <button
        onClick={async () => {
          if (session) await router.push(`/${eventData.nanoid}/pick`);
          else await router.push(`/${eventData.nanoid}/signin`);
        }}
        className="fixed bottom-8 right-8 bg-zinc-300 items-center
        px-4 py-2 rounded-lg flex z-40 shadow-lg">
        <p>{t('schedule_now')}</p>
        <img src="/arrow.svg" alt="" className="ml-4 h-3"/>
      </button>
    </PageContainer>
    <Footer/>
  </div>;
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking'
  };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const eventId = ctx.params?.eventId;
  if (!eventId || typeof eventId !== 'string') return {
    props: {},
    redirect: { destination: '/', }
  };
  if (eventId.length !== 6) {
    return { notFound: true, };
  }
  const event = await getEvent(eventId);
  const results = await getPicks(eventId);
  return {
    revalidate: 1,
    props: {
      results,
      event,
      ...(await serverSideTranslations(
        ctx.locale ? ctx.locale : 'en-US',
        ['common']))
    }
  };
};
