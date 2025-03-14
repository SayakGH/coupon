import CouponClaim from '@/components/CouponClaim';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header>
      <nav className="border-b border-white py-4 px-8 flex justify-between items-center">
        <div className="text-xl font-bold">MyCoupons</div>
        <ul className="flex space-x-6">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
        </ul>
      </nav>
      </header>
      
      <section>
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center max-w-lg bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Coupon Distribution System</h1>
          <p className="mb-6 text-gray-300">
            Welcome! Click the button below to claim your coupon. Please note that you can only claim one coupon per hour.
          </p>
          <CouponClaim />
        </div>
      </div>

      </section>
      
    </main>
  );
}
