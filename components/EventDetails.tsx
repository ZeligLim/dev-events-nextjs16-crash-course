import {notFound} from "next/navigation";
import {IEvent} from "@/database/event.model";
import {getSimilarEventsBySlug} from "@/lib/actions/event.actions";
import Image from "next/image";
import {cacheLife} from "next/cache";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({icon, alt, lable}: { icon: string; alt: string; lable: string }) => (
  <div className={"flex-row-gap-2 items-center"}>
    <Image src={icon} alt={alt} width={17} height={17}/>
    <p>{lable}</p>
  </div>
)

const EventAgenda = ({agendaItem}: { agendaItem: string[] }) => (
  <div>
    <h2>Agenda</h2>
    <ul>
      {agendaItem.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({tags}: { tags: string[] }) => (
  <div className="flex flex-row gap-2 flex-wrap">
    {tags.map((tag) => (
      <div className={"pill"} key={tag}>{tag}</div>
    ))}
  </div>

)

const EventDetails = async ({ params }: { params: Promise<string>}) => {
  
  'use cache';
  cacheLife('hours');
  const slug = await params;
  
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  const {
    event: {
      _id,
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      tags,
      organizer
    }
  } = await request.json();
  
  if (!description) return notFound();
  
  const bookings = 10;
  
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
  
  return (
    <section id={"event"}>
      <div className={"header"}>
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      
      <div className={"details"}>
        {/* left side - event content */}
        <div className={"content"}>
          <Image src={image} alt={"Event Banner"} width={800} height={800} className={"banner"}/>
          <section className={"flex-col-gap-2"}>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          
          <section className={"flex-col-gap-2"}>
            <h2>Event Details</h2>
            <EventDetailItem icon={"/icons/calendar.svg"} alt={"calander"} lable={date}/>
            <EventDetailItem icon={"/icons/clock.svg"} alt={"clock"} lable={time}/>
            <EventDetailItem icon={"/icons/pin.svg"} alt={"pin"} lable={location}/>
            <EventDetailItem icon={"/icons/mode.svg"} alt={"mode"} lable={mode}/>
            <EventDetailItem icon={"/icons/audience.svg"} alt={"audience"} lable={audience}/>
          </section>
          <EventAgenda agendaItem={agenda}/>
          <section className={"flex-col-gap-2"}>
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags}/>
        </div>
        {/* right side - booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} others who have booked their spot!
              </p>
            ) : (
              <p className="text-sm">
                Be the first to book your spot!
              </p>
            )}
            <BookEvent eventId={_id} slug={slug}/>
          </div>
        </aside>
      </div>
      
      <div className={"mt-20"}>
        <h2>Similar Events</h2>
        <div className="events list-none mt-2">
          {similarEvents.length > 0 && similarEvents.map((similarEvent) => (
            <EventCard key={similarEvent.title} {...similarEvent} />
          ))}
        </div>
      </div>
    </section>
  
  )
}
export default EventDetails
