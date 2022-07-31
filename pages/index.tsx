import { TimeRange } from '@models/time';
import { DateValue } from '@models/date';
import TwoColumnTimePicker from '@components/TwoColumnTimePicker';
import Footer from '@components/Footer';
import TopNav from '@components/TopNav';
import PageHead from '@components/PageHead';
import PageContainer from '@components/PageContainer';
import DatePicker from '@components/DatePicker';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import cx from 'classnames';
import type { NextPage } from 'next';

const Home: NextPage = () => {

  const { t } = useTranslation();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [selectedTime, setSelectedTime] = useState<TimeRange[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateValue[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  const [isMissingTitle, setIsMissingTitle] = useState(false);
  const [isMissingDate, setIsMissingDate] = useState(false);
  const [isMissingTime, setIsMissingTime] = useState(false);

  async function submit() {

    if (!title) {
      document.getElementById('title-input')
        ?.scrollIntoView({ behavior: 'smooth' });
      setIsMissingTitle(true);
      return;
    }

    if (selectedDate.length === 0) {
      document.getElementById('date-input')
        ?.scrollIntoView({ behavior: 'smooth' });
      setIsMissingDate(true);
      return;
    }

    if (selectedTime.length === 0) {
      document.getElementById('time-input')
        ?.scrollIntoView({ behavior: 'smooth' });
      setIsMissingTime(true);
      return;
    }

    setIsCreating(true);
    NProgress.start();
    try {
      const res = await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          availableDates: selectedDate.map(d => d.toString()),
          availableTimes: selectedTime.map(t => t.toString())
        }),
      });
      const data = await res.json();
      await router.push('/created/' + data.nanoid);
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
      NProgress.done();
    }
  }

  return (
    <div>
      <PageHead/>
      <TopNav/>
      <PageContainer>
        <div className="mt-8">
          <p
            className="text-2xl mb-4 font-bold"
            id="title-input">
            {t('create_event_name_input_label')}
          </p>
          <input
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              e.target.value.length > 0 && setIsMissingTitle(false);
            }}
            className={cx('rounded-xl text-lg px-2 py-1',
              isMissingTitle
                ? 'border-amber-500 border-4'
                : 'border border-black')}
          />
        </div>

        <div className="mt-16" id="date-input">
          <div className="mb-12">
            <p className="text-2xl font-bold">
              {t('create_event_date_input_label')}
            </p>
            {isMissingDate && <p className="text-amber-500">
              {t('create_event_date_input_error')}
            </p>}
          </div>
          <DatePicker
            value={selectedDate}
            onChange={v => {
              setSelectedDate(v);
              v.length > 0 && setIsMissingDate(false);
            }}/>
        </div>

        <div className="mt-16" id="time-input">
          <div className="mb-12">
            <p className="text-2xl font-bold">
              {t('create_event_time_input_label')}
            </p>
            {isMissingTime && <p className="text-amber-500">
              {t('create_event_time_input_error')}
            </p>}
          </div>
        </div>
        <TwoColumnTimePicker
          value={selectedTime}
          onChange={v => {
            setSelectedTime(v);
            v.length > 0 && setIsMissingTime(false);
          }}/>
        <button
          disabled={isCreating}
          onClick={submit}
          className="fixed bottom-8 right-8 bg-zinc-300 items-center
        px-4 py-2 rounded-lg flex z-50 shadow-lg">
          <p>{isCreating ? 'Wait ...' : t('create_event_submit_label')}</p>
          <img src="/arrow.svg" alt="" className="ml-4 h-3"/>
        </button>
      </PageContainer>
      <Footer/>
    </div>
  );
};

export async function getStaticProps({ locale }: any) {
  return { props: { ...(await serverSideTranslations(locale, ['common'])) } };
}

export default Home;
