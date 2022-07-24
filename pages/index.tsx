import TimeRangePicker from '../components/TimeRangePicker';
import { Time, TimeRange } from '../models/time';
import Head from 'next/head';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import type { NextPage } from 'next';

function getOptions(start: Time, end: Time, duration: 30 | 60) {
  const result: TimeRange[] = [];
  let time = start;
  while (time < end) {
    result.push(TimeRange(time, time.addMinutes(duration)));
    time = time.addMinutes(duration);
  }
  return result;
}

const Home: NextPage = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<TimeRange[]>([]);
  const leftTimeOptions = getOptions(Time(0, 0), Time(12, 0), 60);
  const rightTimeOptions = getOptions(Time(12, 0), Time(24, 0), 60);
  return (
    <div>
      <Head>
        <title>Pick time with friends - PICKTIME</title>
        <meta
          name="description"
          content="A tool that help you pick time with friends."/>
      </Head>

      <div className="w-full md:max-w-xl px-8 mb-24 mx-auto">

        <div className="w-full flex justify-center py-8">
          <img src="/PICKTIME.svg" width={120} alt="PICKTIME"/>
        </div>

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
        </div>

        <div className="mt-16">
          <p className="text-2xl mb-12 font-bold">
            {t('create_event_time_input_label')}
          </p>
          <div className="w-full flex gap-4">
            <div className="relative -top-[10px] text-right">
              {leftTimeOptions.map(
                (opt) => <p key={opt.toString()} style={{ height: 36 }}>
                  {opt.start.toString()}
                </p>)}
            </div>
            <div className="flex-grow">
              <TimeRangePicker
                slotHeight={36}
                value={selected}
                onChange={setSelected}
                options={leftTimeOptions}/>
            </div>
            <div className="flex-grow">
              <TimeRangePicker
                slotHeight={36}
                value={selected}
                onChange={setSelected}
                options={rightTimeOptions}/>
            </div>
            <div className="relative -top-[10px]">
              {rightTimeOptions.map(
                (opt) => <p key={opt.toString()} style={{ height: 36 }}>
                  {opt.start.toString()}
                </p>)}
            </div>
          </div>
        </div>

      </div>

      <div className="w-full bg-gray-100 pt-12 pb-24 flex justify-center">
        <div className="mx-8 w-full md:w-96">
          <img
            src="/PICKTIME.svg"
            width={120}
            alt="PICKTIME"
            className="mb-12"/>
          <div className="w-full flex">
            <div className="flex flex-col flex-grow">
              <p className="opacity-30 mb-4">Languages</p>
              <Link passHref href="/" locale="en-US">
                <a className="my-1">English</a>
              </Link>
              <Link passHref href="/" locale="zh-TW">
                <a className="my-1">繁體中文</a>
              </Link>
              <Link passHref href="/" locale="zh-CN">
                <a className="my-1">简体中文</a>
              </Link>
            </div>
            <div className="flex-grow">
              <p className="opacity-30 mb-4">Other Links</p>
              <a href="https://github.com/yuaanlin/pick-time.io">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }: any) {
  return { props: { ...(await serverSideTranslations(locale, ['common'])) } };
}

export default Home;
