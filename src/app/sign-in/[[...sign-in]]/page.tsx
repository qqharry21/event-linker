import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid min-h-[calc(100dvh-80px)] place-content-center p-4 md:p-6">
      <SignIn />
    </div>
  );
}
