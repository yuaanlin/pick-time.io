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

  return <Head>
    <title>{title || t('default_website_title')} - PICKTIME</title>
    <meta
      name="description"
      content={description || t('default_website_description')}/>
    <meta name="og:image" content={imageUrl}/>
    <meta name="og:url" content={url || 'https://pick-time.io/'}/>
  </Head>;
}

export default PageHead;
