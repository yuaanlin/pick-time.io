import PageHead from '../../components/PageHead';
import PageContainer from '../../components/PageContainer';
import Footer from '../../components/Footer';
import getEvent from '../../services/getEvent';
import TopNav from '../../components/TopNav';
import { parseEventData, SerializedEventData } from '../../models/event';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Props {
  event: SerializedEventData;
}

export default function (props: Props) {
  const { event } = props;
  const { t } = useTranslation();
  const eventData = parseEventData(event);
  const router = useRouter();
  return <div>
    <PageHead/>
    <PageContainer>
      <TopNav/>
      <p className="text-2xl">
        {t('created_title')}
      </p>
      <div>
        <div
          className="flex items-center border-2 mt-4 mb-2
           border-black rounded-xl px-2 py-1">
          <Link href="/[eventId]" passHref as={'/' + event.nanoid}>
            <a className="flex-grow pr-4">
              <input
                id="event-link"
                readOnly
                className="w-full"
                value={'https://pick-time.io/' + (router.locale === 'en-US'
                  ? ''
                  : (router.locale + '/')) + event.nanoid}/>
            </a>
          </Link>
          <div
            className="border-l-2 border-black px-4"
            onClick={() => {
              const copyText = document.getElementById(
                'event-link') as HTMLInputElement;
              copyText.select();
              document.execCommand('copy');
            }}>
            <img src="/link.svg" alt=""/>
          </div>
        </div>
      </div>
      <p className="opacity-40">
        {t('created_link_info')}
      </p>

      <div className="my-8">
        <p className="text-lg mb-2">
          {t('event_name_label')}
        </p>
        <p className="text-2xl text-[#FD6A00]">
          {eventData.title}
        </p>
      </div>
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
