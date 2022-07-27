import getEvent from './getEvent';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const getServerSidePropsWithEventData: GetServerSideProps = async (ctx) => {
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

export default getServerSidePropsWithEventData;
