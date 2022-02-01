import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";

import { FaPencilAlt, FaTimes } from "react-icons/fa";
import styles from "@/styles/Event.module.css";
import Link from "next/link";
import Image from "next/image";

export default function EventsPage({ evt }) {
  const deleteEvent = (e) => {
    console.log("delete");
  };
  return (
    <Layout title="Event Detail">
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              {" "}
              <FaPencilAlt /> Edit Event
            </a>
          </Link>
          <a className={styles.delete} href="#" onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>
        <span>
          {new Date(evt.date).toLocaleDateString("en-GB")} at {evt.time}
        </span>
        <h1> {evt.name}</h1>
        {evt.image && evt.image.date && (
          <div className={styles.image}>
            <Image
              src={
                evt.image &&
                evt.image.data &&
                evt.image.data.attributes.formats.medium.url
              }
              width={960}
              height={600}
              alt={evt.name}
            />
          </div>
        )}
        <h3> Performers: </h3>
        <p> {evt.performers}</p>
        <h3> Description: </h3>
        <p> {evt.description}</p>
        <h3> Venue: {evt.venue} </h3>
        <p>{evt.address}</p>
        <Link href="/events">
          <a className={styles.back}> {"<"} Go Back </a>
        </Link>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  // needs to return paths
  const res = await fetch(`${API_URL}/events`);
  const json = await res.json();
  const events = json.data;
  const paths = events.map((evt) => ({
    params: { slug: evt.attributes.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(
    `${API_URL}/events?filters[slug][$eq]=${slug}&populate=*`
  );
  const json = await res.json();
  const evt = json.data[0];
  return { props: { evt: evt.attributes } };
}

// export async function getServerSideProps({ query: { slug } }) {
//   console.log(slug);
//   const res = await fetch(`${API_URL}/api/events/${slug}`)

//   const events = await res.json();

//   return { props: { evt: events[0] } }
// }
