import DashboardTab from '@/components/dashboard-tab';

export default function Default() {
  return (
    <main className=' w-full px-4 md:px-6 mt-4 md:mt-6'>
      <div className='container mx-auto  '>
        <DashboardTab />
        <div className=''>Dashboard Default Home</div>
      </div>
    </main>
  );
}
