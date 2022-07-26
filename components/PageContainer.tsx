import { PropsWithChildren } from 'react';

function PageContainer(props: PropsWithChildren<{}>) {
  return <div className="w-full md:max-w-xl px-4 mb-24 mx-auto">
    {props.children}
  </div>;
}

export default PageContainer;
