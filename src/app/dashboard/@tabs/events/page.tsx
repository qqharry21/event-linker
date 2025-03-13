import { Metadata } from "next";
import EventForm from "./_ui/event-form";

export const metadata: Metadata = {
  title: "Create Event",
};

export default async function Page() {
  return (
    <div className="w-full">
      <EventForm />
    </div>
  );
}
