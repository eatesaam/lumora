import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { installErrorReporter } from '../lib/errorReporter';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    installErrorReporter();
  }, []);
  return (
    <>
      <Head>
        <title>Lumora — Media Agency</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Lumora is a media agency crafting films, brands and campaigns." />
      </Head>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </>
  );
}