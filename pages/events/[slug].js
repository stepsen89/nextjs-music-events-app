import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "@/styles/Event.module.css";

export default function EventsPage({ evt }) {
  const eventData = evt.attributes;

  return (
    <Layout title="Event Detail">
      <div className={styles.event}>
        {/* <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              {" "}
              <FaPencilAlt /> Edit Event
            </a>
          </Link>
          <a className={styles.delete} href="#" onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div> */}
        <span>
          {new Date(eventData.date).toLocaleDateString("en-GB")} at{" "}
          {eventData.time}
        </span>
        <h1> {eventData.name}</h1>
        <ToastContainer />
        {eventData.image && eventData.image.data && (
          <div className={styles.image}>
            <Image
              src={
                eventData.image &&
                eventData.image.data &&
                eventData.image.data.attributes.formats.medium.url
              }
              width={960}
              height={600}
              alt={eventData.name}
            />
          </div>
        )}
        <h3> Performers: </h3>
        <p> {eventData.performers}</p>
        <h3> Description: </h3>
        <p> {eventData.description}</p>
        <h3> Venue: {eventData.venue} </h3>
        <p>{eventData.address}</p>
        <Link href="/events">
          <a className={styles.back}> {"<"} Go Back </a>
        </Link>
      </div>
    </Layout>
  );
}

// export async function getStaticPaths() {
//   // needs to return paths
//   const res = await fetch(`${API_URL}/events`);
//   const json = await res.json();
//   const events = json.data;
//   const paths = events.map((evt) => ({
//     params: { slug: evt.attributes.slug },
//   }));

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params: { slug } }) {
//   const res = await fetch(
//     `${API_URL}/events?filters[slug][$eq]=${slug}&populate=*`
//   );
//   const json = await res.json();
//   const evt = json.data[0];
//   return { props: { evt: evt } };
// }

export async function getServerSideProps({ query: { slug } }) {
  const res = await fetch(
    `${API_URL}/events?filters[slug][$eq]=${slug}&populate=*`
  );

  const jsonData = await res.json();
  const evt = jsonData.data[0];

  return { props: { evt: evt } };
}
