import Link from "next/link";
import Image from "next/image";
import styles from '@/styles/EventItem.module.css';

export default function EventItem({ evt }) {
  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image src={evt.image || '/images/event-default.png'} height={100} width={170} alt={evt.name} />
      </div>
      <div className={styles.info}>
        <span> {evt.date} at {evt.time} </span>
        <h3> {evt.name} </h3>
      </div>
      <div className={styles.link}>
        <Link href={`/events/${evt.slug}`}>
          <a className="btn"> Details </a>
        </Link>
      </div>
    </div>
  )
}
