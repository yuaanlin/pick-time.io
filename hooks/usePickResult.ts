import { EventPicksResults } from '@models/Pick';
import { DateTimeRange } from '@models/DateTimeRange';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';

function usePickResult(nanoid: string) {
  const [result, setResult] = useState<EventPicksResults>();

  useEffect(() => {
    refresh();
  }, [nanoid]);

  async function refresh() {
    NProgress.start();
    try {
      const res = await fetch(`/api/events/${nanoid}/pick`);
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
