import Head from 'next/head'
import { FC } from 'react';
import { Navbar, SideMenu } from '../ui';

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
  children?: React.ReactNode | undefined;
}

export const ShopLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
  return (
    <>
      {/* Head  */}
      <Head>
        <title>{title}</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        <meta name='description' content={pageDescription} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={pageDescription} />
        {imageFullUrl && <meta property='og:image' content={imageFullUrl} />}
      </Head>


      {/* Navbar  */}
      <nav>
        <Navbar />
      </nav>


      {/* sidebar  */}
      <SideMenu />


      {/* Main  */}
      <main style={{
        margin: '80px auto',
        maxWidth: '1440px',
        padding: '0px 30px',
      }} >
        {children}
      </main>


      {/* Footer  */}
      <footer>
      </footer>

    </>
  )
}
