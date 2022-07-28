import Head from 'next/head';
import { useTranslation } from 'next-i18next';

interface Props {
  title?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
}

function PageHead(props: Props) {

  const {
    title,
    description,
    imageUrl,
    url
  } = props;

  const { t } = useTranslation();
  const titleValue = title || t('default_website_title') + ' - PICKTIME';

  return <Head>
    <title>{titleValue}</title>
    <meta
      name="description"
      content={description || t('default_website_description')}/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="og:image" content={imageUrl || '/og.png'}/>
    <meta name="og:url" content={url || 'https://pick-time.io/'}/>
  </Head>;
}

export default PageHead;
