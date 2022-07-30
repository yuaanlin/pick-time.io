import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Noto+Sans+TC:400,500,700,900&subset=chinese-traditional"
          rel="stylesheet"/>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-P01F9W2K3H"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-P01F9W2K3H');`,
          }}
        />
      </Head>
      <body>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  );
}
