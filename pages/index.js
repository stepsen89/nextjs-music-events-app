import Layout from "/components/Layout";
import Head from 'next/head';

import { API_URL } from '@/config/index';

export default function Home({ events }) {
  return (
    <div>
      {/* <Head> <title> DJ Events </title></Head> */}
      <Layout>
        <h1> Upcoming events </h1>
      </Layout>
    </div>
  );
}

// this would log server side - runs everytime we come to the page
// export async function getServerSideProps() {
//   const res = await fetch(`${API_URL}/api/events`);
//   const events = await res.json()

//   return {
//     props: { events },
//     revalidate: 1
//   }
// }

// fetching at build time
// drawback: generated at build time
export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events`);
  const events = await res.json()

  return {
    props: { events },
    revalidate: 1 // revalidates after a certain number of seconds
  }
}
