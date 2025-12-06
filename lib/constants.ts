// Shared event constants for the app
// Images referenced here live under public/images

export type Event = {
  title: string;
  image: string; // public path, e.g. "/images/event1.png"
  slug: string;
  location: string;
  date: string; // human-readable date
  time: string; // human-readable time (with timezone if helpful)
};

export const events: Event[] = [
  {
    title: "JSConf EU 2026",
    image: "/images/event1.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "May 23–24, 2026",
    time: "09:00–17:30 CEST",
  },
  {
    title: "Next.js Worldwide Summit 2026",
    image: "/images/event2.png",
    slug: "nextjs-summit-2026",
    location: "San Francisco, CA, USA",
    date: "April 16–17, 2026",
    time: "09:30–18:00 PDT",
  },
  {
    title: "Hack the Planet 48h Hackathon",
    image: "/images/event3.png",
    slug: "hack-the-planet-2026",
    location: "Remote / Global",
    date: "March 6–8, 2026",
    time: "Starts 18:00 UTC",
  },
  {
    title: "React Summit Amsterdam 2026",
    image: "/images/event4.png",
    slug: "react-summit-ams-2026",
    location: "Amsterdam, Netherlands",
    date: "June 11–12, 2026",
    time: "09:00–17:00 CEST",
  },
  {
    title: "Google Cloud Next '26 — Developer Day",
    image: "/images/event5.png",
    slug: "google-cloud-next-26-dev-day",
    location: "Las Vegas, NV, USA",
    date: "May 5, 2026",
    time: "10:00–17:00 PDT",
  },
  {
    title: "Open Source Summit Europe 2026",
    image: "/images/event6.png",
    slug: "oss-summit-eu-2026",
    location: "Vienna, Austria",
    date: "September 14–17, 2026",
    time: "All day CEST",
  },
  {
    title: "Full‑Stack Fest 2026",
    image: "/images/event-full.png",
    slug: "full-stack-fest-2026",
    location: "Barcelona, Spain",
    date: "October 7–9, 2026",
    time: "09:00–18:00 CEST",
  },
];
