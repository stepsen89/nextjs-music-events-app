import Layout from "/components/Layout";
import Head from "next/head";
import EventItem from "@/components/EventItem";

import { API_URL } from "@/config/index";
import Link from "next/link";

import qs from "qs";
import Pagination from "@/components/Pagination";

const PER_PAGE = 5;

export default function EventsPage({ evts, total, page }) {
  const lastPage = Math.ceil(total / PER_PAGE);

  return (
    <div>
      {/* <Head> <title> DJ Events </title></Head> */}
      <Layout>
        <h1> Events </h1>
        {evts.length === 0 && <h3> No events to show </h3>}
        {evts.map((evt) => {
          const evtData = evt.attributes;
          return <EventItem key={evtData.slug} evt={evtData} />;
        })}
        <Pagination page={page} total={total} />
      </Layout>
    </div>
  );
}

// @EXAMPLE
// this would log server side - runs everytime we come to the page
// export async function getServerSideProps() {
//   const res = await fetch(`${API_URL}/api/events`);
//   const events = await res.json()

//   return {
//     props: { events },
//     revalidate: 1
//   }
// }

// @EXAMPLE
// fetching at build time
// drawback: generated at build time
// export async function getStaticProps() {
//   const res = await fetch(`${API_URL}/events?populate=*&_sort=date:ASC`);
//   const json = await res.json();
//   const events = json.data;
//   return {
//     props: { evts: events },
//     revalidate: 1 // revalidates after a certain number of seconds (only static props)
//   }
// }

export async function getServerSideProps({ query: { page = 1 } }) {
  const query = qs.stringify(
    {
      pagination: {
        page: page,
        pageSize: PER_PAGE,
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  console.log(page);
  const res = await fetch(
    `${API_URL}/events?${query}&populate=*&_sort=date:ASC`
  );
  const json = await res.json();
  const events = json.data;
  const total = json.meta.pagination.total;
  console.log(json);
  return {
    props: { evts: events, total, page },
  };
}
