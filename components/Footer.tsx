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
        className="mb-12"/>
      <div className="w-full flex">
        <div className="flex flex-col flex-grow">
          <p className="opacity-30 mb-4">Languages</p>
          <Link
            passHref
            href={router.pathname}
            as={router.asPath}
            locale="en-US">
            <a className="my-1">English</a>
          </Link>
          <Link
            passHref
            href={router.pathname}
            as={router.asPath}
            locale="zh-TW">
            <a className="my-1">繁體中文</a>
          </Link>
          <Link
            passHref
            href={router.pathname}
            as={router.asPath}
            locale="zh-CN">
            <a className="my-1">简体中文</a>
          </Link>
        </div>
        <div className="flex-grow">
          <p className="opacity-30 mb-4">Other Links</p>
          <a href="https://github.com/yuaanlin/pick-time.io">GitHub</a>
        </div>
      </div>
    </div>
  </div>;
}

export default Footer;
