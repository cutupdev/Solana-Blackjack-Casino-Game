import Head from 'next/head'
import Home from './home'
export default function Index() {
  return (
    <>
      <Head>
        <title>SlowRUG</title>
        <meta name="description" content="SlowRUG | Best Crypto PvP Gambling Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Home/>
    </>
  )
}
