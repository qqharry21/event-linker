import { Separator } from "@/components/ui/separator";

export function EventsHeader() {
  return (
    <>
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Events Overview</h1>
        <p className="text-muted-foreground">
          View and manage your recently created events
        </p>
      </div>
      <Separator />
    </>
  );
}
