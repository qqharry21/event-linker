import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="mt-4 w-full cursor-pointer"
      disabled={pending}
    >
      {pending ? "Loading..." : "Create Event"}
    </Button>
  );
};
