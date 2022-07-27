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
import type { NextPage } from 'next';

const Home: NextPage = () => {

  const { t } = useTranslation();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [selectedTime, setSelectedTime] = useState<TimeRange[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateValue[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  async function submit() {
    NProgress.start();
    try {
      if (!title || selectedTime.length === 0 || selectedDate.length === 0)
        return;
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
          <p className="text-2xl mb-4 font-bold">
            {t('create_event_name_input_label')}
          </p>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="border rounded-xl border-black text-lg px-2 py-1"
          />
        </div>

        <div className="mt-16 ">
          <p className="text-2xl mb-12 font-bold">
            {t('create_event_date_input_label')}
          </p>
          <DatePicker value={selectedDate} onChange={setSelectedDate}/>
        </div>

        <div className="mt-16">
          <p className="text-2xl mb-12 font-bold">
            {t('create_event_time_input_label')}
          </p>
        </div>
        <TwoColumnTimePicker value={selectedTime} onChange={setSelectedTime}/>
        <button
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
