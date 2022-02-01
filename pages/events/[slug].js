import Layout from "@/components/Layout";
import { API_URL } from "@/config/index";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FaPencilAlt, FaTimes } from "react-icons/fa";
import styles from "@/styles/Event.module.css";
import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/router";

export default function EventsPage({ evt }) {
  const router = useRouter();

  console.log(evt);

  const deleteEvent = async (e) => {
    if (confirm("Are you sure?")) {
      const res = await fetch(`${API_URL}/events/${evt.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push("/events");
      }
    }
  };

  const eventData = evt.attributes;
  return (
    <Layout title="Event Detail">
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${eventData.id}`}>
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
          {new Date(eventData.date).toLocaleDateString("en-GB")} at{" "}
          {eventData.time}
        </span>
        <h1> {eventData.name}</h1>
        <ToastContainer />
        {eventData.image && eventData.image.date && (
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
  return { props: { evt: evt } };
}

// export async function getServerSideProps({ query: { slug } }) {
//   console.log(slug);
//   const res = await fetch(`${API_URL}/api/events/${slug}`)

//   const events = await res.json();

//   return { props: { evt: events[0] } }
// }
