import useSession from './useSession';
import { EventPicksResults } from '@models/Pick';
import { DateTimeRange } from '@models/DateTimeRange';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';

function usePickResult(nanoid: string) {
  const session = useSession(nanoid);
  const [result, setResult] = useState<EventPicksResults>();

  useEffect(() => {
    if (session) refresh();
  }, [session, nanoid]);

  async function refresh() {
    NProgress.start();
    try {
      const res = await fetch(`/api/events/${nanoid}/pick`,
        { headers: { Authorization: `Bearer ${session.token}` } });
      const json = await res.json() as { name: string, picks: string[] }[];
      setResult(json.map(v => ({
        ...v,
        picks: v.picks.map(p => DateTimeRange().fromString(p))
      })));
    } catch (err) {
      console.error(err);
    } finally {
      NProgress.done();
    }
  }

  return {
    result,
    refresh
  };
}

export default usePickResult;
