import useSession, { useUpdateSession } from '@hooks/useSession';
import { parseEventData, SerializedEventData } from '@models/event';
import PageHead from '@components/PageHead';
import PageContainer from '@components/PageContainer';
import Footer from '@components/Footer';
import TopNav from '@components/TopNav';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getEventProps } from '@services/getEventProps';

interface Props {
  event: SerializedEventData;
}

function signIn(props: Props) {
  const { t } = useTranslation();
  const { event } = props;
  const eventData = parseEventData(event);
  const session = useSession(eventData.nanoid);
  const updateSession = useUpdateSession();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session) router.push(`/${eventData.nanoid}/pick`);
  }, []);

  async function submit() {
    if (!name) return;
    const res = await fetch(`/api/events/${eventData.nanoid}/signIn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        password
      }),
    });
    const data = await res.json();
    updateSession(eventData.nanoid, data.name, data.token);
    await router.push(`/${eventData.nanoid}/pick`);
  }

  return (
    <div>
      <PageHead
        title={t('event_page_title', { eventTitle: event.title })}/>
      <PageContainer>
        <TopNav/>
        <div className="mt-12">
          <p className="text-2xl mb-4">{t('username_label')}</p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="border rounded-xl border-black text-lg px-2 py-1"
          />
        </div>
        <div className="mt-8">
          <p className="text-2xl mb-2">{t('password_label')}</p>
          <p className="mb-4 opacity-40">{t('password_description_label')}</p>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border rounded-xl border-black text-lg px-2 py-1"
          />
        </div>
        <button
          className="fixed bottom-8 right-8 bg-zinc-300 items-center
        px-4 py-2 rounded-lg flex z-50 shadow-lg"
          onClick={submit}>
          <p>{t('schedule_now')}</p>
          <img src="/arrow.svg" alt="" className="ml-4 h-3"/>
        </button>
      </PageContainer>
      <Footer/>
    </div>
  );
}

export default signIn;

export const getStaticPaths = () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps = getEventProps;
