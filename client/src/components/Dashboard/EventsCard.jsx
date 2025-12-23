import { CalendarDays } from "lucide-react";

export default function EventsCard() {
  const events = [
    {
      title: "Final Year Project Proposal Deadline",
      date: "Oct 12, 2025",
    },
    {
      title: "Career Fair",
      date: "Oct 20, 2025",
    },
  ];

  return (
    <div className="bg-card border rounded-xl p-5">
      <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <CalendarDays className="w-5 h-5" />
        Upcoming Events
      </h2>

      <ul className="space-y-3">
        {events.map((event, idx) => (
          <li key={idx}>
            <p className="font-medium">{event.title}</p>
            <p className="text-muted-foreground text-sm">{event.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
