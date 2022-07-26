import { TimeRange } from '../models/time';
import TwoColumnTimePicker from '../components/TwoColumnTimePicker';
import Footer from '../components/Footer';
import TopNav from '../components/TopNav';
import PageHead from '../components/PageHead';
import PageContainer from '../components/PageContainer';
import { DateValue } from '../models/date';
import DatePicker from '../components/DatePicker';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import type { NextPage } from 'next';

const Home: NextPage = () => {

  const { t } = useTranslation();

  const [selectedTime, setSelectedTime] = useState<TimeRange[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateValue[]>([]);

  return (
    <div>
      <PageHead/>
      <TopNav/>
      <PageContainer>
        <div className="mt-8">
          <p className="text-2xl mb-4 font-bold">
            {t('create_event_name_input_label')}
          </p>
          <input className="border rounded-xl border-black text-lg px-2 py-1"/>
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
          className="fixed bottom-8 right-8 bg-zinc-300 items-center
        px-4 py-2 rounded-lg flex z-50 shadow-lg">
          <p>{t('create_event_submit_label')}</p>
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
