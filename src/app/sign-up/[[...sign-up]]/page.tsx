import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className='min-h-[calc(100dvh-80px)] grid place-content-center p-4 md:p-6'>
      <SignUp />
    </div>
  );
}
