import Head from "next/head";
import { useRouter } from "next/router";

import Header from './Header';
import Footer from './Footer';
import Showcase from "./Showcase";
// styles
import styles from "@/styles/Layout.module.css";

export default function Layout({ title, keywords, description, children }) {
  const router = useRouter();

  return (
    <div>
      {/* displays title, meta tags for html generation */}
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
      </Head>
      <Header />
      {router.pathname === '/' && <Showcase />}
      <div className={styles.container}>{children}</div>
      <Footer />
    </div>
  );
}

// using default values, because it will not always be passed as props to use it
Layout.defaultProps = {
  title: "DJ events | Find the hottest parties",
  description: "Find the latest music events",
  keywords: "music",
};
