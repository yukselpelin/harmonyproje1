import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html suppressHydrationWarning={true} lang="tr">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
