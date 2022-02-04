import qs from "qs";
import { useRouter } from "next/router";
import Link from "next/link";

import Layout from "/components/Layout";
import EventItem from "@/components/EventItem";

import { API_URL } from "@/config/index";

export default function SearchPage({ evts }) {
  const router = useRouter();
  return (
    <div>
      <Layout title="Search Results">
        <Link href="/events"> Go Back </Link>
        <h1> Search Results for: {router.query.term}</h1>
        {evts.length === 0 && <h3> No events to show </h3>}
        {evts.map((evt) => {
          const evtData = evt.attributes;
          return <EventItem key={evtData.slug} evt={evtData} />;
        })}
      </Layout>
    </div>
  );
}

// because we don't know what someone would search for hence getserversideprops
export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify(
    {
      filters: {
        $or: [
          {
            name: {
              $containsi: term,
            },
          },
          {
            description: {
              $containsi: term,
            },
          },
          {
            venue: {
              $containsi: term,
            },
          },
          {
            performers: {
              $containsi: term,
            },
          },
        ],
      },
    },
    {
      encodeValuesOnly: true,
    }
  );
  // let queryString = `filters[$or][0][name][$containsi]=${term}&filters[$or][1][description][$containsi]=${term}`
  // const res = await fetch(`${API_URL}/events?${queryString}&populate=*`);
  const res = await fetch(`${API_URL}/events?${query}&populate=*`);
  const json = await res.json();
  const events = json.data;
  return {
    props: { evts: events },
  };
}
