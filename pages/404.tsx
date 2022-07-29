import Footer from '@components/Footer';
import TopNav from '@components/TopNav';
import PageHead from '@components/PageHead';
import PageContainer from '@components/PageContainer';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import type { NextPage } from 'next';

const NotFound: NextPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <PageHead/>
      <TopNav/>
      <PageContainer>
        <p>{t('event_not_found_label')}</p>
        <Link href="/">
          <button
            className="fixed bottom-8 right-8 bg-zinc-300 items-center
        px-4 py-2 rounded-lg flex z-50 shadow-lg">
            <p>{t('create_new_event_label')}</p>
            <img src="/arrow.svg" alt="" className="ml-4 h-3"/>
          </button>
        </Link>
      </PageContainer>
      <Footer/>
    </div>
  );
};

export async function getStaticProps({ locale }: any) {
  return { props: { ...(await serverSideTranslations(locale, ['common'])) } };
}

export default NotFound;
