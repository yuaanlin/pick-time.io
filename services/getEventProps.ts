import { GetStaticProps } from 'next';
import getEvent from '@services/getEvent';
import getPicks from '@services/getPicks';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getEvnetAndResultProps: GetStaticProps = async (ctx) => {
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

export const getEventProps: GetStaticProps = async (ctx) => {
  const eventId = ctx.params?.eventId;
  if (!eventId || typeof eventId !== 'string') return {
    props: {},
    redirect: { destination: '/', }
  };
  if (eventId.length !== 6) {
    return { notFound: true, };
  }
  const event = await getEvent(eventId);
  return {
    revalidate: 1,
    props: {
      event,
      ...(await serverSideTranslations(
        ctx.locale ? ctx.locale : 'en-US',
        ['common']))
    }
  };
};
