import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Pick time with friends - PICKTIME</title>
        <meta name="description" content="A tool that help you pick time with friends." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <p className="font-extrabold text-4xl">PICKTIME</p>
        <p className="opacity-60 mb-12">is currently woring in progress.</p>
        <p>Stay tuned!</p>
      </div>
    </div>
  )
}

export default Home
