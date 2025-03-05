import DashboardTab from '@/components/dashboard-tab';

const title = 'Parallel Routes';

export const metadata = {
  title,
  openGraph: {
    title,
  },
};

export default function Layout({ tabs }: { tabs: React.ReactNode }) {
  return (
    <main className=' w-full px-4 md:px-6 mt-4 md:mt-6'>
      <div className='container mx-auto overflow-hidden'>
        <div className='flex items-center justify-center'>
          <DashboardTab />
        </div>
        {tabs}
      </div>
    </main>
  );
}
