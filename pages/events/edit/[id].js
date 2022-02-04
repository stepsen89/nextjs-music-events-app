import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { FaImage } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Modal from "@/components/Modal";
import Layout from "@/components/Layout";
import ImageUpload from "@/components/ImageUpload";

import { API_URL } from "@/config/index";
import { parseCookies } from "@/helpers/index";

import styles from "@/styles/Form.module.css";

export default function EditEventPage({ evt, token }) {
  console.log(token);
  const [values, setValues] = useState({
    name: evt.attributes.name,
    performers: evt.attributes.performers,
    address: evt.attributes.address,
    date: evt.attributes.date,
    time: evt.attributes.time,
    description: evt.attributes.description,
    venue: evt.attributes.venue,
  });

  const [imagePreview, setImagePreview] = useState(
    evt.attributes && evt.attributes.image && evt.attributes.image.data
      ? evt.attributes.image.data.attributes.formats.thumbnail.url
      : null
  );

  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const imageUploaded = async (e) => {
    const res = await fetch(`${API_URL}/events/${evt.id}?populate=*`);
    const fullData = await res.json();
    const data = fullData.data;
    setImagePreview(
      data.attributes.image.data.attributes.formats.thumbnail.url
    );
    setShowModal(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // validation - check if values object has an empty field
    const hasEmptyFields = Object.values(values).some(
      (element) => element === ""
    );

    if (hasEmptyFields) {
      toast.error("Fields are missing");
    }

    const res = await fetch(`${API_URL}/events/${evt.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: values }),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error("Unauthorised");
        return;
      }
      toast.error("Something went wrong");
    } else {
      const data = await res.json();
      const evt = data.data;
      router.push(`/events/${evt.attributes.slug}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  return (
    <Layout title="Add New Event">
      <Link href="/events"> Go Back </Link>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Edit Event</h1>
        <ToastContainer />
        <div className={styles.grid}>
          <div>
            <label htmlFor="name"> Event Name </label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="performers"> Performers </label>
            <input
              type="text"
              id="performers"
              name="performers"
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="venue"> Venue </label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="address"> Address </label>
            <input
              type="text"
              id="address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date"> Date </label>
            <input
              type="date"
              id="date"
              name="date"
              value={moment(values.date).format("yyyy-MM-DD")}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="time"> Time </label>
            <input
              type="text"
              id="time"
              name="time"
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Event Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            value={values.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type="submit" value="Update Event" className="btn" />
      </form>
      <h2> Event Image: </h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} alt={values.name} />
      ) : (
        <div>
          {" "}
          <p> No image uploaded</p>
        </div>
      )}
      <div>
        <button onClick={() => setShowModal(true)} className="btn-secondary">
          {" "}
          <FaImage /> Set Image{" "}
        </button>{" "}
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        {" "}
        <ImageUpload
          evtId={evt.id}
          imageUploaded={imageUploaded}
          token={token}
        />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps({ params: { id }, req }) {
  const res = await fetch(`${API_URL}/events/${id}?populate=*`);
  const evt = await res.json();

  const { token } = parseCookies(req);

  return {
    props: { evt: evt.data, token },
  };
}
