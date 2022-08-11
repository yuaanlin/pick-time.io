import { parseEventData, SerializedEventData } from '@models/event';
import PageHead from '@components/PageHead';
import PageContainer from '@components/PageContainer';
import Footer from '@components/Footer';
import TopNav from '@components/TopNav';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import DatePicker from '@components/DatePicker';
import TwoColumnTimePicker from '@components/TwoColumnTimePicker';
import { getEventProps } from '@services/getEventProps';
import toast, { Toaster } from 'react-hot-toast';

interface Props {
  event: SerializedEventData;
}

export default function (props: Props) {
  const { event } = props;
  const { t } = useTranslation();
  const eventData = parseEventData(event);
  const router = useRouter();
  const copyToast = () =>
    toast(t('copy_successful'), {
      duration: 4000,
      position: 'top-center',
      icon: '✅',
    });
  return <div>
    <PageHead/>
    <PageContainer>
      <TopNav/>
      <Toaster/>
      <p className="text-2xl">
        {t('created_title')}
      </p>
      <div>
        <div
          className="flex items-center border-2 mt-4 mb-2
           border-black rounded-xl px-2 py-1">
          <a
            className="flex-grow pr-4"
            href={'https://pick-time.io/' + (router.locale === 'en-US'
              ? '' : (router.locale + '/')) + event.nanoid}
            target="_blank"
            rel="noopener noreferrer"
          >
            <input
              id="event-link"
              readOnly
              className="w-full"
              value={'https://pick-time.io/' + (router.locale === 'en-US'
                ? '' : (router.locale + '/')) + event.nanoid}
            />
          </a>
          <div
            className="border-l-2 border-black px-4"
            onClick={() => {
              const copyText = document.getElementById(
                'event-link') as HTMLInputElement;
              copyText.select();
              document.execCommand('copy');
              copyToast();
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

      <div className="mt-16 ">
        <p className="text-2xl mb-12 font-bold">
          {t('available_dates_label')}
        </p>
        <DatePicker readonly value={eventData.availableDates}/>
      </div>

      <div className="mt-16">
        <p className="text-2xl mb-12 font-bold">
          {t('available_time_label')}
        </p>
      </div>
      <TwoColumnTimePicker readonly value={eventData.availableTimes}/>
    </PageContainer>
    <Footer/>
  </div>;
}

export const getStaticPaths = () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps = getEventProps;
