import "styles/globals.css";
import type { AppProps } from "next/app";
import { MDXProvider } from "@mdx-js/react";
import { ThemeProvider } from "next-themes";

import { components } from "components/mdxStyling";

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
      <MDXProvider components={components}>
        <Component {...pageProps} />
      </MDXProvider>
    </ThemeProvider>
  );
}

export default MyApp;
