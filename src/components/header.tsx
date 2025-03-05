import { PartyPopperIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

export const Header = () => {
  return (
    <header className='sticky top-0 bg-background shadow-sm w-full px-4 md:px-6'>
      <div className='container mx-auto h-20 flex items-center'>
        <Link
          href='#'
          className='mr-6'
          prefetch={false}>
          <PartyPopperIcon />
          <span className='sr-only'>Event Linker</span>
        </Link>
        <div className='ml-auto flex gap-2'>
          <Button
            variant='outline'
            className='justify-self-end px-2 py-1 text-xs'>
            Sign in
          </Button>
          <Button className='justify-self-end px-2 py-1 text-xs'>Sign Up</Button>
        </div>
      </div>
    </header>
  );
};
