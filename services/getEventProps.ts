import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RedisClient from '@utils/getRedis';

export const getEventAndResultProps: GetStaticProps = async (ctx) => {
  const eventId = ctx.params?.eventId;
  if (!eventId || typeof eventId !== 'string') return {
    props: {},
    redirect: { destination: '/', }
  };
  if (eventId.length !== 6) {
    return { notFound: true, };
  }
  const redis = new RedisClient();
  const event = await redis.getEvent(eventId);
  const results = await redis.getPicks(eventId) || [];
  if (!event) return { notFound: true };
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
  const redis = new RedisClient();
  const event = await redis.getEvent(eventId);
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
