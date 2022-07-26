import Head from 'next/head';

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

  return <Head>
    <title>{title || 'Pick time with friends'} - PICKTIME</title>
    <meta
      name="description"
      content={description || 'A tool that help you pick time with friends.'}/>
    <meta name="og:image" content={imageUrl}/>
    <meta name="og:url" content={url || 'https://pick-time.io/'}/>
  </Head>;
}

export default PageHead;
