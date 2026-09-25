import Head from 'next/head';
import ContactPage from '@/components/ContactPage';

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact | Lumora</title>
      </Head>
      <ContactPage />
    </>
  );
}