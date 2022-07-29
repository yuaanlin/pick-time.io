import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RedisClient from '@utils/getRedis';

const getServerSidePropsWithEventData: GetServerSideProps = async (ctx) => {
  const eventId = ctx.query.eventId;
  if (!eventId || typeof eventId !== 'string') return {
    props: {},
    redirect: { destination: '/', }
  };
  if (eventId.length !== 6) {
    ctx.res.statusCode = 404;
    return {
      props: {},
      redirect: { destination: '/', }
    };
  }
  const redis = new RedisClient();
  const event = await redis.getEvent(eventId);
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
