import Link from 'next/link';

function TopNav() {
  return <div className="w-full flex justify-center py-8">
    <Link href="/">
      <img src="/PICKTIME.svg" width={120} alt="PICKTIME"/>
    </Link>
  </div>;

}

export default TopNav;
