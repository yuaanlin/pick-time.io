import Link from 'next/link';
import { useRouter } from 'next/router';

function Footer() {
  const router = useRouter();
  return <div className="w-full bg-gray-100 pt-12 pb-24 flex justify-center">
    <div className="mx-8 w-full md:w-96">
      <img
        src="/PICKTIME.svg"
        width={120}
        alt="PICKTIME"
        className="mb-12"
      />
      <div className="w-full flex mb-12">
        <div className="flex flex-col flex-grow">
          <p className="opacity-30 mb-4">Languages</p>
          <Link
            passHref
            href={router.pathname}
            as={router.asPath}
            locale="en-US"
            className="my-1"
          >
            English
          </Link>
          <Link
            passHref
            href={router.pathname}
            as={router.asPath}
            locale="zh-TW"
            className="my-1"
          >
            繁體中文
          </Link>
          <Link
            passHref
            href={router.pathname}
            as={router.asPath}
            locale="zh-CN"
            className="my-1"
          >
            简体中文
          </Link>
        </div>
        <div className="flex-grow">
          <p className="opacity-30 mb-4">Other Links</p>
          <a href="https://github.com/yuaanlin/pick-time.io">GitHub</a>
        </div>
      </div>
      <a
        href="https://zeabur.com?referralCode=yuaanlin&utm_source=pick-time.io"
      >
        <img
          src="https://zeabur.com/deployed-on-zeabur-dark.svg"
          alt="Deployed on Zeabur"
        />
      </a>
    </div>
  </div>
  ;
}

export default Footer;
