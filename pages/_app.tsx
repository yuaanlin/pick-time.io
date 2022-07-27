import '../styles/globals.css';
import { SessionContext, SessionContextType } from '@hooks/useSession';
import { appWithTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import { Router } from 'next/router';
import type { AppProps } from 'next/app';
import 'nprogress/nprogress.css';

function MyApp({
  Component,
  pageProps
}: AppProps) {

  useEffect(() => {
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();
    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);
    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  const [session, setSession] = useState<SessionContextType>({
    events: {},
    updateSession: (nanoid, name, token) => {
      const newSession = {
        ...session,
        events: {
          ...session.events,
          [nanoid]: {
            name,
            token
          }
        }
      };
      setSession(newSession);
      localStorage.setItem('session', JSON.stringify(newSession));
    }
  });

  useEffect(() => {
    const events = JSON.parse(
      localStorage.getItem('session') || '{"events": {}}');
    setSession({
      ...session,
      ...events,
    });
  }, []);

  return <SessionContext.Provider value={session}>
    <Component {...pageProps} />
  </SessionContext.Provider>;
}

export default appWithTranslation(MyApp);
