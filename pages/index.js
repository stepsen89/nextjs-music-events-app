import Layout from "/components/Layout";
import Head from 'next/head';
import EventItem from "@/components/EventItem";
import Link from "next/link";

import { API_URL } from '@/config/index';

export default function Home({ events }) {
  return (
    <div>
      {/* <Head> <title> DJ Events </title></Head> */}
      <Layout>
        <h1> Upcoming events </h1>
        {events.length === 0 && <h3> No events to show </h3>}
        {events.map(evt => (
          <EventItem key={evt.id} evt={evt} />
        ))}
        {events.length > 0 && (
          <Link href='/events'>
            <a className="btn-secondary"> View all events </a>
          </Link>
        )}

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
    props: { events: events.slice(0, 3) },
    revalidate: 1 // revalidates after a certain number of seconds
  }
}
