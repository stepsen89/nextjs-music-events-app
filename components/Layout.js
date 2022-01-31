import Head from "next/head";
import Header from './Header';
import Footer from './Footer';

// styles
import styles from "@/styles/Layout.module.css";

export default function Layout({ title, keywords, description, children }) {
  return (
    <div>
      {/* displays title, meta tags for html generation */}
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
      </Head>
      <Header />
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
